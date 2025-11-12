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
import { demo, generateId } from "./Util";
import supabase from "./config/supabaseConfig";

export interface ParlayTask {
  id: string;
  team: string;
  betType: string;
  text: string;
  odds: number;
}

export interface ParlayAction {
  type: string;
  id: string;
  text: string;
  odds: number;
  betType?: string;
  team?: string;
  oppId?: string;
  totalOdds?: number;
  payout?: number;
  wager?: number;
  user_id?: string;
  parlay_id?: string;
  parlay_modification_type?: string;
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

export interface ParlayUpdatePayload {
  user_id: string;
  parlay_id: string;
  parlay_modification_type: string;
}

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>(null);
  const [balance, setBalance] = useState<number>(0);
  const [parlayLegs, setParlayLegs] = useState<ParlayTask[]>([]);
  const [currentParlay, setCurrentParlay] = useState<ParlayInfo>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [matchup, setMatchup] = useState<number>(0);
  const [justAffectedBalance, setJustAffectedBalance] =
    useState<boolean>(false);
  const [parlayUpdatePayload, setParlayUpdatePayload] =
    useState<ParlayUpdatePayload>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: import.meta.env.VITE_AUTH_EMAIL,
        password: import.meta.env.VITE_AUTH_PASS,
      });

      if (error) {
        setErrorMessage(error.message + " refresh page");
      }

      if (data) {
        supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        const getMatchup = async () => {
          const { data, error } = await supabase
            .from("matchup")
            .select()
            .order("id", { ascending: false })
            .limit(1);

          if (error) {
            setErrorMessage(error.message);
          }

          if (data) {
            setErrorMessage("");
            setMatchup(data[0]["id"]);
          }
        };
        getMatchup();
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
        setErrorMessage(error.message);
        console.log(error);
      }

      if (data) {
        setErrorMessage("");
        if (data.length == 0) {
          const { data, error } = await supabase
            .from("users")
            .insert([{ id: user.id, name: user.name, profile: user.profile }])
            .select();
          if (error) {
            setErrorMessage(error.message);
            console.log(error);
          }

          if (data) {
            setErrorMessage("");
            const balance: number = data[0]["balance"];
            setBalance(balance);
          }
        } else {
          setErrorMessage("");
          const balance: number = data[0]["balance"];
          setBalance(balance);
        }
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const tasksReducer = (tasks: ParlayTask[], action: ParlayAction) => {
    switch (action.type) {
      case "addLeg": {
        tasks = tasks.filter((task) => task.id !== action.oppId);
        tasks = [
          ...tasks,
          {
            id: action.id,
            team: action.team,
            betType: action.betType,
            text: action.text,
            odds: action.odds,
          },
        ];
        return tasks;
      }
      case "removeLeg": {
        return tasks.filter((task) => task.id !== action.id);
      }
      case "submitParlay": {
        setParlayLegs(tasks);
        setCurrentParlay({
          totalOdds: action.totalOdds,
          payout: action.payout,
          wager: action.wager,
        });
        setJustAffectedBalance(true);
        return [];
      }
      case "acceptPayout": {
        setJustAffectedBalance(true);
        setParlayUpdatePayload({
          user_id: action.user_id,
          parlay_id: action.parlay_id,
          parlay_modification_type: action.parlay_modification_type,
        });
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
          setErrorMessage(error.message);
          console.log(error);
        }

        if (data) {
          setErrorMessage("");
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
          .update({ balance: balance })
          .eq("id", user.id);

        if (error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("");
        }
      };
      updateBalance();
    }
  }, [balance, user, justAffectedBalance]);

  useEffect(() => {
    if (user && parlayUpdatePayload) {
      const temp: ParlayUpdatePayload = {
        user_id: parlayUpdatePayload.user_id,
        parlay_id: parlayUpdatePayload.parlay_id,
        parlay_modification_type: parlayUpdatePayload.parlay_modification_type,
      };
      setParlayUpdatePayload(null);
      if (temp.parlay_modification_type === "acceptPayout") {
        const updateParlay = async () => {
          const { error } = await supabase
            .from("parlays")
            .update({ is_payed_out: true })
            .eq("user_id", temp.user_id)
            .eq("parlay_id", temp.parlay_id);

          if (error) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("");
          }
        };
        updateParlay();
      }
    }
  }, [user, parlayUpdatePayload]);

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
            errorMessage={errorMessage}
          />
          <Routes>
            <Route path="/" element={<Dashboard weeklySlate={demo} />} />
            <Route
              path="/parlays"
              element={
                <Parlays
                  setBalance={setBalance}
                  user={user}
                  setErrorMessage={setErrorMessage}
                />
              }
            />
          </Routes>
        </TasksDispatchContext>
      </TasksContext>
    </Router>
  );
}

export default App;
