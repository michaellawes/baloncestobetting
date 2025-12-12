import { Dashboard } from "./components/dashboard/Dashboard";
import "./App.css";
import { Navbar } from "./components/nav/Navbar";
import { Parlays } from "./components/parlays/Parlays";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import {
  TasksContext,
  TasksDispatchContext,
} from "./components/reducer/TasksContext";
import {
  decimalToOdds,
  generateId,
  getDaysSinceLastMonday,
  oddsToDecimal,
} from "./utils/Util";
import supabase from "./config/supabaseConfig";
import { LiveParlayViewer } from "./components/nav/LiveParlayViewer";
import { Notification } from "./components/notification/Notification";
import { Matchup } from "./components/matchup/Matchup";
import { ErrorLander } from "./components/errors/ErrorLander";
import {
  MatchupSchema,
  NotificationMetadata,
  ParlayAction,
  ParlayFieldUpdate,
  ParlayInfo,
  ParlayTask,
  Player,
  Team,
  UserData,
} from "./utils/Interfaces";
import { propField, specialLegTypes } from "./utils/Constants";

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>(null);
  const [balance, setBalance] = useState<number>(0);
  const [parlayLegs, setParlayLegs] = useState<ParlayTask[]>([]);
  const [currentParlay, setCurrentParlay] = useState<ParlayInfo>(null);
  const [matchup, setMatchup] = useState<number>(-1);
  const [weeklySlate, setWeeklySlate] = useState<MatchupSchema[]>([]);
  const [specials, setSpecials] = useState<Player[]>([]);
  const [justAffectedBalance, setJustAffectedBalance] =
    useState<boolean>(false);
  const [parlayFieldUpdate, setParlayFieldUpdate] =
    useState<ParlayFieldUpdate>(null);
  const [justAffectedParlayFieldUpdate, setJustAffectedParlayFieldUpdate] =
    useState<boolean>(false);
  const [isViewingDashboard, setIsViewingDashboard] = useState<boolean>(true);
  const [isViewingMatchup, setIsViewingMatchup] = useState<boolean>(false);
  const [lockout, setLockout] = useState<boolean>(false);
  const [notificationMetadata, setNotificationMetadata] =
    useState<NotificationMetadata>({
      show: false,
      legs: 0,
      message: "",
      type: "INITIAL",
    });
  const [currentMatchup, setCurrentMatchup] = useState<MatchupSchema>(null);

  const getUpdatedParlayValues = (legs: ParlayTask[]) => {
    const updatedArray: ParlayTask[] = [];
    for (const leg of legs) {
      const relevantMatchup: MatchupSchema = weeklySlate.filter(
        (slate) => slate.home.name === leg.team || slate.road.name === leg.team,
      )[0];
      const relevantTeam: Team =
        relevantMatchup.home.name === leg.team
          ? relevantMatchup.home
          : relevantMatchup.road;
      const propMetadata = leg.frontend_id.split("/");
      const betType = propMetadata[propMetadata.length - 1];
      if (betType === propField[4]) {
        const relevantPlayerFilter: Player[] = relevantTeam.top_5.filter(
          (player) => player.name === propMetadata[0],
        );
        if (relevantPlayerFilter.length > 0) {
          const relevantPlayer = relevantPlayerFilter[0];
          updatedArray.push({
            frontend_id: leg.frontend_id,
            team: leg.team,
            parlay_id: "temp",
            matchup_id: matchup,
            day_id: getDaysSinceLastMonday(),
            text: leg.text.substring(0, 2) + relevantPlayer.prop_line.text,
            odds: leg.text.startsWith("U")
              ? relevantPlayer.prop_line.under_odds
              : relevantPlayer.prop_line.over_odds,
          });
        }
      } else if (betType === propField[3]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          parlay_id: "temp",
          matchup_id: matchup,
          day_id: getDaysSinceLastMonday(),
          text: leg.text.substring(0, 2) + relevantTeam.team_total.text,
          odds: leg.text.startsWith("U")
            ? relevantTeam.team_total.under_odds
            : relevantTeam.team_total.over_odds,
        });
      } else if (betType === propField[2]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          parlay_id: "temp",
          matchup_id: matchup,
          day_id: getDaysSinceLastMonday(),
          text: relevantTeam.moneyline.text,
          odds: relevantTeam.moneyline.odds,
        });
      } else if (betType === propField[1]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          parlay_id: "temp",
          matchup_id: matchup,
          day_id: getDaysSinceLastMonday(),
          text: relevantTeam.points.text,
          odds: relevantTeam.points.odds,
        });
      } else if (betType === propField[0]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          parlay_id: "temp",
          matchup_id: matchup,
          day_id: getDaysSinceLastMonday(),
          text: relevantTeam.spread.text,
          odds: relevantTeam.spread.odds,
        });
      }
    }
    return updatedArray;
  };

  const isInvalidOpposingSpreadForMoneyLineAddition = (
    team: string,
    isHome: boolean,
  ) => {
    let relevantMatchup: MatchupSchema;
    if (isHome) {
      relevantMatchup = weeklySlate.filter(
        (slate) => slate.road.name === team,
      )[0];
      return relevantMatchup.road.spread.text.startsWith("-");
    } else {
      relevantMatchup = weeklySlate.filter(
        (slate) => slate.home.name === team,
      )[0];
      return relevantMatchup.home.spread.text.startsWith("-");
    }
  };

  useEffect(() => {
    const authenticateUser = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: import.meta.env.VITE_AUTH_EMAIL,
        password: import.meta.env.VITE_AUTH_PASS,
      });

      if (error) {
        console.log(error);
      }

      if (data) {
        supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
    };

    const startOfLateLockout = new Date();
    const endOfLateLockout = new Date();
    startOfLateLockout.setHours(9, 0, 0, 0);
    endOfLateLockout.setUTCDate(endOfLateLockout.getUTCDate() + 1);
    endOfLateLockout.setHours(0, 10, 0, 0);

    const startOfEarlyLockout = new Date();
    const endOfEarlyLockout = new Date();
    startOfEarlyLockout.setHours(0, 0, 0, 0);
    endOfEarlyLockout.setHours(0, 10, 0, 0);
    const currentTime = new Date();
    if (
      (currentTime >= startOfLateLockout && currentTime < endOfLateLockout) ||
      (currentTime >= startOfEarlyLockout && currentTime < endOfEarlyLockout)
    ) {
      setLockout(true);
    }
    authenticateUser();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", user.id);

      if (error) {
        console.log(error);
      }

      if (data) {
        if (data.length == 0) {
          const { data, error } = await supabase
            .from("users")
            .insert([{ id: user.id, name: user.name, profile: user.profile }])
            .select();
          if (error) {
            console.log(error);
          }

          if (data) {
            const balance: number = data[0]["balance"];
            setBalance(parseFloat(balance.toFixed(2)));
          }
        } else {
          const balance: number = data[0]["balance"];
          setBalance(parseFloat(balance.toFixed(2)));
        }
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (parlayLegs.length > 0 && currentParlay != null) {
      const now = new Date();
      const expires = new Date();
      expires.setUTCDate(
        expires.getUTCDate() + ((7 - expires.getUTCDay()) % 7) + 1,
      );
      expires.setHours(0, 0, 0, 0);
      const parlayId = generateId();

      const uploadParlay = async () => {
        const newParlay = {
          user_id: user.id,
          parlay_id: parlayId,
          created_at: now.toUTCString(),
          expires_at: expires.toUTCString(),
          matchup_id: matchup,
          total_odds: parseFloat(currentParlay.totalOdds.toFixed()),
          payout: parseFloat(currentParlay.payout.toFixed(2)),
          wager: parseFloat(currentParlay.wager.toFixed(2)),
          day_id: getDaysSinceLastMonday(),
          is_winner: false,
          is_active: true,
        };

        await supabase
          .from("fb_parlays")
          .insert([newParlay])
          .then((response) => {
            if (response.error) {
              throw response.error;
            }

            for (const leg of parlayLegs) {
              leg.parlay_id = parlayId;
            }

            supabase
              .from("fb_parlay_legs")
              .insert(parlayLegs)
              .then((response) => {
                if (response.error) throw response.error;
                setParlayLegs([]);
                setCurrentParlay(null);
              });
          });
      };
      uploadParlay();
    }
  }, [parlayLegs, currentParlay, user, matchup]);

  useEffect(() => {
    if (user && justAffectedBalance) {
      setJustAffectedBalance(false);
      const updateBalance = async () => {
        const { error } = await supabase
          .from("users")
          .update({ balance: parseFloat(balance.toFixed(2)) })
          .eq("id", user.id);

        if (error) {
          console.log(error);
        }
      };
      updateBalance();
    }
  }, [user, justAffectedBalance, balance]);

  useEffect(() => {
    if (user && justAffectedParlayFieldUpdate) {
      const temp: ParlayFieldUpdate = {
        user_id: parlayFieldUpdate.user_id,
        parlay_id: parlayFieldUpdate.parlay_id,
        parlay: parlayFieldUpdate.parlay,
        parlay_modification_type: parlayFieldUpdate.parlay_modification_type,
        payout: parlayFieldUpdate.payout,
      };
      setJustAffectedParlayFieldUpdate(false);
      if (temp.parlay_modification_type === "validateSlip") {
        const updateParlay = async () => {
          await supabase
            .from("fb_parlays")
            .update({
              is_winner: temp.parlay.is_winner,
              is_active: temp.parlay.is_active,
            })
            .eq("user_id", temp.user_id)
            .eq("parlay_id", temp.parlay_id)
            .then((response) => {
              if (response.error) {
                throw response.error;
              }

              supabase
                .from("fb_parlay_legs")
                .upsert(temp.parlay.legs)
                .then((response) => {
                  if (response.error) throw response.error;
                });
            });
        };
        updateParlay();
      }
    }
  }, [user, parlayFieldUpdate, justAffectedParlayFieldUpdate]);

  useEffect(() => {
    if (!justAffectedParlayFieldUpdate) {
      setParlayFieldUpdate(null);
    }
  }, [justAffectedParlayFieldUpdate]);

  const tasksReducer = (tasks: ParlayTask[], action: ParlayAction) => {
    switch (action.type) {
      case "addLeg": {
        tasks = tasks.filter((task) => task.frontend_id !== action.oppId);
        if (
          action.special_leg_type !== undefined &&
          action.special_leg_type === specialLegTypes[1]
        ) {
          tasks = tasks.filter(
            (task) =>
              task.special_leg_type === undefined ||
              task.special_leg_type !== specialLegTypes[1],
          );
        }
        if (action.betType === propField[0] && action.text.startsWith("-")) {
          tasks = tasks.filter(
            (task) =>
              task.frontend_id !==
              action.oppId.split("/")[0] + "/" + propField[2],
          );
        }
        if (action.betType === propField[2]) {
          const opposingTeam = action.oppId.split("/")[0];
          if (
            isInvalidOpposingSpreadForMoneyLineAddition(
              opposingTeam,
              action.isHome,
            )
          ) {
            tasks = tasks.filter(
              (task) =>
                task.frontend_id !==
                action.oppId.split("/")[0] + "/" + propField[0],
            );
          }
        }
        if (
          action.betType === propField[0] ||
          action.betType === propField[2]
        ) {
          const teamName = action.frontend_id.split("/")[0];
          const teamRelatedLegs = tasks.filter(
            (task) => task.frontend_id.split("/")[0] === teamName,
          );

          const teamRelatedProps: Set<string> = new Set<string>(
            teamRelatedLegs.map(
              (task) =>
                task.frontend_id.split("/")[
                  task.frontend_id.split("/").length - 1
                ],
            ),
          );
          if (
            (action.betType === propField[0] &&
              teamRelatedProps.has(propField[2])) ||
            (action.betType === propField[2] &&
              teamRelatedProps.has(propField[0]))
          ) {
            if (
              action.special_leg_type === undefined ||
              action.special_leg_type !== specialLegTypes[0]
            ) {
              for (const leg of tasks) {
                const legTokens = leg.frontend_id.split("/");
                const legBetType = legTokens[legTokens.length - 1];
                if (
                  action.team === legTokens[0] &&
                  ((action.betType === propField[0] &&
                    legBetType === propField[2]) ||
                    (action.betType === propField[2] &&
                      legBetType === propField[0]))
                ) {
                  const allOdds = new Set<number>(
                    [
                      parseFloat(decimalToOdds(oddsToDecimal(19.1)).toFixed()),
                      action.odds,
                      leg.odds,
                    ].sort((a, b) => a - b),
                  );
                  const lowestTwoOdds = Array.from(allOdds);
                  action.odds = lowestTwoOdds[0];
                  leg.odds =
                    lowestTwoOdds[
                      lowestTwoOdds.length > 2
                        ? lowestTwoOdds.length - 2
                        : lowestTwoOdds.length - 1
                    ];
                }
              }
            }
          }
        }
        if (tasks.length === 25) {
          setNotificationMetadata({
            legs: 0,
            show: true,
            message: "Max legs added!",
            type: "LIMIT",
          });
          return tasks;
        } else {
          tasks = [
            ...tasks,
            {
              frontend_id: action.frontend_id,
              team: action.team,
              parlay_id: "temp",
              matchup_id: matchup,
              day_id: getDaysSinceLastMonday(),
              text: action.text,
              odds: action.odds,
              special_leg_type:
                action.special_leg_type !== undefined
                  ? action.special_leg_type
                  : undefined,
            },
          ];
          return tasks;
        }
      }
      case "removeLeg": {
        return tasks.filter((task) => task.frontend_id !== action.frontend_id);
      }
      case "submitParlay": {
        for (let i = 0; i < tasks.length; i++) {
          tasks[i].index = i;
        }
        setParlayLegs(tasks);
        let shouldBoostParlay = false;
        shouldBoostParlay = tasks.every(
          (leg) =>
            leg.special_leg_type !== undefined &&
            leg.special_leg_type === specialLegTypes[0],
        );
        setCurrentParlay({
          totalOdds: shouldBoostParlay
            ? parseFloat(
                decimalToOdds(oddsToDecimal(action.totalOdds) * 1.5).toFixed(),
              )
            : action.totalOdds,
          payout: action.payout,
          wager: action.wager,
        });
        setJustAffectedBalance(true);
        setNotificationMetadata({
          show: true,
          legs: tasks.length,
          message: " leg parlay saved!",
          type: "SUBMIT",
        });
        return [];
      }
      case "parlayFieldUpdate": {
        setJustAffectedParlayFieldUpdate(true);
        return tasks;
      }
      case "updateBalanceAfterWinning": {
        setJustAffectedBalance(true);
        return tasks;
      }
      case "clearSlip": {
        return [];
      }
      case "loadSharedSlip": {
        return getUpdatedParlayValues(action.legs);
      }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [tasks, dispatch] = useReducer(tasksReducer, []);

  return (
    <Router>
      <TasksContext value={tasks}>
        <TasksDispatchContext value={dispatch}>
          <Navbar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            balance={balance}
            setBalance={setBalance}
            setUser={setUser}
            isViewingDashboard={isViewingDashboard}
            isViewingMatchup={isViewingMatchup}
            matchup={matchup}
          />
          <Notification
            notification={notificationMetadata}
            setNotification={setNotificationMetadata}
          />
          <Routes>
            <Route
              path="/:parlayId?"
              element={
                <Dashboard
                  weeklySlate={weeklySlate}
                  setIsViewingDashboard={setIsViewingDashboard}
                  setIsViewingMatchup={setIsViewingMatchup}
                  lockout={lockout}
                  setCurrentMatchup={setCurrentMatchup}
                  setWeeklySlate={setWeeklySlate}
                  setSpecials={setSpecials}
                  setMatchup={setMatchup}
                  specials={specials}
                />
              }
            />
            <Route
              path="/parlays"
              element={
                <Parlays
                  setBalance={setBalance}
                  user={user}
                  balance={balance}
                  setParlayFieldUpdate={setParlayFieldUpdate}
                  setIsViewingDashboard={setIsViewingDashboard}
                  setIsViewingMatchup={setIsViewingMatchup}
                  matchups={weeklySlate}
                  matchup={matchup}
                  setNotification={setNotificationMetadata}
                />
              }
            />
            <Route
              path={"/matchup"}
              element={
                <Matchup
                  matchup={currentMatchup}
                  setIsViewingDashboard={setIsViewingDashboard}
                  setIsViewingMatchup={setIsViewingMatchup}
                />
              }
            />
            <Route
              path={"*"}
              element={
                <ErrorLander message="Please return to the homepage and refresh..." />
              }
            />
          </Routes>
          <div className="relative text-white">
            <LiveParlayViewer
              balance={balance}
              setBalance={setBalance}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </TasksDispatchContext>
      </TasksContext>
    </Router>
  );
}

export default App;
