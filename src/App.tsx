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
import { generateId } from "./utils/Util";
import supabase from "./config/supabaseConfig";
import { LiveParlayViewer } from "./components/nav/LiveParlayViewer";
import { Notification } from "./components/notification/Notification";
import { Matchup } from "./components/matchup/Matchup";
import { ErrorLander } from "./components/dashboard/ErrorLander";
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
import { propField } from "./utils/Constants";

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>(null);
  const [balance, setBalance] = useState<number>(0);
  const [parlayLegs, setParlayLegs] = useState<ParlayTask[]>([]);
  const [currentParlay, setCurrentParlay] = useState<ParlayInfo>(null);
  const [matchup, setMatchup] = useState<number>(0);
  const [weeklySlate, setWeeklySlate] = useState<MatchupSchema[]>([]);
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
      if (leg.betType === propField[4]) {
        const relevantPlayerFilter: Player[] = relevantTeam.top_5.filter(
          (player) => player.name === leg.frontend_id.split("/")[0],
        );
        if (relevantPlayerFilter.length > 0) {
          const relevantPlayer = relevantPlayerFilter[0];
          updatedArray.push({
            frontend_id: leg.frontend_id,
            team: leg.team,
            betType: leg.betType,
            text: leg.text.substring(0, 2) + relevantPlayer.prop_line.text,
            odds: leg.text.startsWith("U")
              ? relevantPlayer.prop_line.under_odds
              : relevantPlayer.prop_line.over_odds,
          });
        }
      } else if (leg.betType === propField[3]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          betType: leg.betType,
          text: leg.text.substring(0, 2) + relevantTeam.team_total.text,
          odds: leg.text.startsWith("U")
            ? relevantTeam.team_total.under_odds
            : relevantTeam.team_total.over_odds,
        });
      } else if (leg.betType === propField[2]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          betType: leg.betType,
          text: relevantTeam.moneyline.text,
          odds: relevantTeam.moneyline.odds,
        });
      } else if (leg.betType === propField[1]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          betType: leg.betType,
          text: relevantTeam.points.text,
          odds: relevantTeam.points.odds,
        });
      } else if (leg.betType === propField[0]) {
        updatedArray.push({
          frontend_id: leg.frontend_id,
          team: leg.team,
          betType: leg.betType,
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

      const uploadParlay = async () => {
        const newParlay = {
          user_id: user.id,
          parlay_id: generateId(),
          created_at: +now,
          expires_at: +expires,
          matchup_id: matchup,
          total_odds: parseFloat(currentParlay.totalOdds.toFixed()),
          payout: parseFloat(currentParlay.payout.toFixed(2)),
          wager: parseFloat(currentParlay.wager.toFixed(2)),
          is_winner: false,
          is_payed_out: false,
          legs: parlayLegs,
        };

        const { data, error } = await supabase
          .from("parlays")
          .insert([newParlay]);
        if (error) {
          console.log(error);
        }

        if (data) {
          setParlayLegs([]);
          setCurrentParlay(null);
        }
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
  }, [balance, user, justAffectedBalance]);

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
          const { error } = await supabase
            .from("parlays")
            .update({
              is_winner: temp.parlay.is_winner,
              is_payed_out: temp.parlay.is_payed_out,
              legs: temp.parlay.legs,
            })
            .eq("user_id", temp.user_id)
            .eq("parlay_id", temp.parlay_id);
          console.log(temp.parlay.legs);
          if (error) {
            console.log(error);
          }
        };
        updateParlay();
        if (temp.parlay.is_winner) {
          setBalance((prev) => prev + parseFloat(temp.payout.toFixed(2)));
          setJustAffectedBalance(true);
        }
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
        // Remove road team moneyline if betting home team cover
        if (action.betType == propField[0] && action.text.startsWith("-")) {
          tasks = tasks.filter(
            (task) =>
              task.frontend_id !==
              action.oppId.split("/")[0] + "/" + propField[2],
          );
        }
        if (action.betType == propField[2]) {
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
              betType: action.betType,
              text: action.text,
              odds: action.odds,
            },
          ];
          return tasks;
        }
      }
      case "removeLeg": {
        return tasks.filter((task) => task.frontend_id !== action.frontend_id);
      }
      case "submitParlay": {
        setParlayLegs(tasks);
        setCurrentParlay({
          totalOdds: action.totalOdds,
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
      case "acceptPayout": {
        setJustAffectedBalance(true);
        return tasks;
      }
      case "parlayFieldUpdate": {
        setJustAffectedParlayFieldUpdate(true);
        return tasks;
      }
      case "clearSlip": {
        return [];
      }
      case "loadSharedSlip": {
        const startOfExpirationDate = new Date(action.expires_at);
        startOfExpirationDate.setHours(0, 0, 0, 0);
        if (Date.now() < Date.parse(startOfExpirationDate.toISOString())) {
          return getUpdatedParlayValues(action.legs);
        }
        return tasks;
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
                  setLockout={setLockout}
                  setWeeklySlate={setWeeklySlate}
                  setMatchup={setMatchup}
                />
              }
            />
            <Route
              path="/parlays"
              element={
                <Parlays
                  setBalance={setBalance}
                  user={user}
                  setParlayFieldUpdate={setParlayFieldUpdate}
                  setIsViewingDashboard={setIsViewingDashboard}
                  setIsViewingMatchup={setIsViewingMatchup}
                  matchups={weeklySlate}
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
            <Route path={"*"} element={<ErrorLander />} />
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
