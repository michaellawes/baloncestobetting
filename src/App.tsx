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
import { generateId, MatchupSchema, propField } from "./utils/Util";
import supabase from "./config/supabaseConfig";
import { SupabaseParlay } from "./components/parlays/Parlay";
import { LiveParlayViewer } from "./components/nav/LiveParlayViewer";
import { Notification } from "./components/notification/Notification";
import { Matchup } from "./components/matchup/Matchup";

export interface ParlayTask {
  frontend_id: string;
  team: string;
  betType: string;
  text: string;
  odds: number;
}

export interface ParlayAction {
  type: string;
  frontend_id?: string;
  text?: string;
  odds?: number;
  betType?: string;
  team?: string;
  oppId?: string;
  totalOdds?: number;
  payout?: number;
  wager?: number;
  isHome?: boolean;
  user_id?: string;
  parlay_id?: string;
  is_payed_out?: boolean;
  is_winner?: boolean;
  parlay_modification_type?: string;
  slip?: Slip;
}

export interface ParlayInfo {
  totalOdds: number;
  payout: number;
  wager: number;
}

export interface UserData {
  id: string;
  name: string;
  profile: string;
}

export interface ParlayFieldUpdate {
  user_id: string;
  parlay_id: string;
  parlay_modification_type: string;
  parlay?: SupabaseParlay;
  payout?: number;
}

export interface Slip {
  legs: ParlayTask[];
  matchup_id: string;
  parlay_id: string;
  user_id: string;
  payout: number;
}

export interface NotificationMetadata {
  show: boolean;
  legs: number;
}

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>(null);
  const [balance, setBalance] = useState<number>(0);
  const [parlayLegs, setParlayLegs] = useState<ParlayTask[]>([]);
  const [currentParlay, setCurrentParlay] = useState<ParlayInfo>(null);
  const [supabaseAuthenticated, setSupabaseAuthenticated] =
    useState<boolean>(false);
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
    useState<NotificationMetadata>({ show: false, legs: 0 });
  const [currentMatchup, setCurrentMatchup] = useState<MatchupSchema>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: import.meta.env.VITE_AUTH_EMAIL,
        password: import.meta.env.VITE_AUTH_PASS,
      });

      if (error) {
        console.log(error);
        setSupabaseAuthenticated(false);
      }

      if (data) {
        supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        setSupabaseAuthenticated(true);
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    if (supabaseAuthenticated) {
      const getMatchup = async () => {
        const { data, error } = await supabase
          .from("matchup")
          .select()
          .order("id", { ascending: false })
          .limit(1);

        if (error) {
          console.log(error);
        }

        if (data) {
          setMatchup(data[0]["id"]);
          setLockout(data[0]["is_done"]);
          setWeeklySlate(data[0]["weekly_slate"]);
          //setWeeklySlate(refactoredDemo);
        }
      };
      getMatchup();
    }
  }, [supabaseAuthenticated]);

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
        setNotificationMetadata({ show: true, legs: tasks.length });
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
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const [tasks, dispatch] = useReducer(tasksReducer, []);

  // Submit Parlay
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

  // Update balance for either placing parlay or automatically colleting earnings
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

  // For newly expired parlays, update that it was payed out and whether it won
  useEffect(() => {
    if (user && justAffectedParlayFieldUpdate) {
      const temp: ParlayFieldUpdate = {
        user_id: parlayFieldUpdate.user_id,
        parlay_id: parlayFieldUpdate.parlay_id,
        parlay: parlayFieldUpdate.parlay,
        parlay_modification_type: parlayFieldUpdate.parlay_modification_type,
        payout: parlayFieldUpdate.payout,
      };
      /*
      Add data to backend column to have final result from previous matchup saved so you can display how close user was
      * */
      setJustAffectedParlayFieldUpdate(false);
      if (temp.parlay_modification_type === "validateSlip") {
        const updateParlay = async () => {
          const { error } = await supabase
            .from("parlays")
            .update({
              is_winner: temp.parlay.is_winner,
              is_payed_out: temp.parlay.is_payed_out,
            })
            .eq("user_id", temp.user_id)
            .eq("parlay_id", temp.parlay_id);

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
              path="/"
              element={
                <Dashboard
                  weeklySlate={weeklySlate}
                  setIsViewingDashboard={setIsViewingDashboard}
                  setIsViewingMatchup={setIsViewingMatchup}
                  lockout={lockout}
                  setCurrentMatchup={setCurrentMatchup}
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
            ></Route>
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
