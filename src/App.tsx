import { Dashboard } from "./components/dashboard/Dashboard";
import "./App.css";
import { Navbar } from "./components/nav/Navbar";
import { Parlays } from "./components/dashboard/parlays/Parlays";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import {
  TasksContext,
  TasksDispatchContext,
} from "./components/reducer/TasksContext";
import { ParlaySlipProps } from "./components/dashboard/parlays/Parlay";
import { generateId } from "./Util";
import { MatchupProps } from "./components/dashboard/wagers/Matchup";
import { GoogleOAuthProvider } from "@react-oauth/google"; //import axios from "axios";
//import axios from "axios";

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
}

export interface ParlayInfo {
  totalOdds: number;
  payout: number;
  wager: number;
}

export interface UserData {
  id: string;
  name: string;
}

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>(null);
  const [balance, setBalance] = useState<number>(0);
  const [parlayLegs, setParlayLegs] = useState<ParlayTask[]>([]);
  const [parlays, setParlays] = useState<ParlaySlipProps[]>([]);
  const [currentParlay, setCurrentParlay] = useState<ParlayInfo>(null);

  /*
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          },
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);*/

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
        return [];
      }
      case "clearSlip": {
        return [];
      }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  const demoParlays: ParlaySlipProps[] = [
    {
      id: "44d2e199-c29e-e300-984e-76e0c1435f67",
      isActive: false,
      isPayedOut: false,
      isWinner: false,
      legs: [
        {
          betType: "SPREAD BETTING",
          id: "JASON's TEAMSPREAD BETTING",
          odds: -150,
          team: "JASON's TEAM",
          text: "+100.5",
        },
      ],
      payout: 16.67,
      timestamp: 1762659052276,
      totalOdds: -150,
      wager: 10,
    },
    {
      id: "7be5edb2-b80a-0e2c-b9df-913292fdfa90",
      isActive: true,
      isPayedOut: false,
      isWinner: false,
      legs: [
        {
          betType: "SPREAD BETTING",
          id: "SEB's TEAM-SPREAD BETTING",
          odds: -110,
          team: "SEB's TEAM",
          text: "+70.5",
        },
      ],
      payout: 19.09,
      timestamp: 1762659551675,
      totalOdds: -110,
      wager: 10,
    },
    {
      id: "77e798be-7a4a-bad0-c010-9afece9af2a9",
      isActive: false,
      isPayedOut: false,
      isWinner: false,
      legs: [
        {
          betType: "TOTAL POINTS",
          id: "SEB's TEAM-TOTAL POINTS",
          odds: -150,
          team: "SEB's TEAM v JEFE's TEAM",
          text: "O 3985.5",
        },
        {
          betType: "MONEYLINE",
          id: "SEB's TEAM-MONEYLINE",
          odds: 200,
          team: "SEB's TEAM",
          text: "",
        },
        {
          betType: "TOTAL POINTS",
          id: "JASON's TEAM-TOTAL POINTS",
          odds: -120,
          team: "JASON's TEAM v MICHAEL's TEAM",
          text: "O 3785.5",
        },
        {
          betType: "MONEYLINE",
          id: "MICHAEL's TEAM-MONEYLINE",
          odds: -120,
          team: "MICHAEL's TEAM",
          text: "",
        },
      ],
      payout: 168.06,
      timestamp: 1762659923491,
      totalOdds: 1581,
      wager: 10,
    },
    {
      id: "73d8db1c-5fc6-e506-b5dd-c796678143bd",
      isActive: false,
      isPayedOut: false,
      isWinner: true,
      legs: [
        {
          betType: "SPREAD BETTING",
          id: "JORDAN's TEAM-SPREAD BETTING",
          odds: -110,
          team: "JORDAN's TEAM",
          text: "+35.5",
        },
        {
          betType: "TOTAL POINTS",
          id: "JARON's TEAM-TOTAL POINTS",
          odds: 125,
          team: "JORDAN's TEAM v JARON's TEAM",
          text: "U 3985.5",
        },
        {
          betType: "TOTAL POINTS",
          id: "SEB's TEAM-TOTAL POINTS",
          odds: -150,
          team: "SEB's TEAM v JEFE's TEAM",
          text: "O 3985.5",
        },
        {
          betType: "SPREAD BETTING",
          id: "MICHAEL's TEAM-SPREAD BETTING",
          odds: -110,
          team: "MICHAEL's TEAM",
          text: "-100.5",
        },
        {
          betType: "SPREAD BETTING",
          id: "SEB's TEAM-SPREAD BETTING",
          odds: -110,
          team: "SEB's TEAM",
          text: "+70.5",
        },
      ],
      payout: 978.46,
      timestamp: 1762660109548,
      totalOdds: 9685,
      wager: 10,
    },
  ];

  const demo: MatchupProps[] = [
    {
      matchupSlate: [
        {
          teamProps: {
            icon: "IMAGE-2",
            name: "SEB's TEAM",
            record: "2-0",
            color: "text-white",
          },
          propLineProps: [
            { text: "+70.5", odds: -110 },
            { text: "O 3985.5", odds: -150 },
            { text: "", odds: +200 },
          ],
        },
        {
          teamProps: {
            icon: "IMAGE",
            name: "JEFE's TEAM",
            record: "2-0",
            color: "text-black",
          },
          propLineProps: [
            { text: "-70.5", odds: -110 },
            { text: "U 3985.5", odds: +125 },
            { text: "", odds: -120 },
          ],
        },
      ],
    },
    {
      matchupSlate: [
        {
          teamProps: {
            icon: "IMAGE-2",
            name: "JASON's TEAM",
            record: "0-2",
            color: "text-white",
          },
          propLineProps: [
            { text: "+100.5", odds: -150 },
            { text: "O 3785.5", odds: -120 },
            { text: "", odds: +275 },
          ],
        },
        {
          teamProps: {
            icon: "IMAGE",
            name: "MICHAEL's TEAM",
            record: "1-1",
            color: "text-black",
          },
          propLineProps: [
            { text: "-100.5", odds: -110 },
            { text: "U 3785.5", odds: -130 },
            { text: "", odds: -120 },
          ],
        },
      ],
    },
    {
      matchupSlate: [
        {
          teamProps: {
            icon: "IMAGE-2",
            name: "JORDAN's TEAM",
            record: "0-2",
            color: "text-white",
          },
          propLineProps: [
            { text: "+35.5", odds: -110 },
            { text: "O 4100.5", odds: -220 },
            { text: "", odds: +200 },
          ],
        },
        {
          teamProps: {
            icon: "IMAGE",
            name: "JARON's TEAM",
            record: "1-1",
            color: "text-black",
          },
          propLineProps: [
            { text: "-35.5", odds: -150 },
            { text: "U 3985.5", odds: +125 },
            { text: "", odds: -185 },
          ],
        },
      ],
    },
  ];

  const [tasks, dispatch] = useReducer(tasksReducer, []);

  useEffect(() => {
    if (parlayLegs.length > 0 && currentParlay != null) {
      const newParlay: ParlaySlipProps = {
        id: generateId(),
        timestamp: Date.now(),
        legs: parlayLegs,
        totalOdds: parseFloat(currentParlay.totalOdds.toFixed()),
        payout: parseFloat(currentParlay.payout.toFixed(2)),
        wager: parseFloat(currentParlay.wager.toFixed(2)),
        isActive: false,
        isWinner: false,
        isPayedOut: false,
      };
      setParlayLegs([]);
      setParlays([...parlays, newParlay]);
      setCurrentParlay(null);
    }
  }, [parlayLegs, currentParlay, parlays]);
  //
  //
  return (
    <Router>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <TasksContext value={tasks}>
          <TasksDispatchContext value={dispatch}>
            <Navbar
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              balance={balance}
              setBalance={setBalance}
              setUser={setUser}
            />
            <Routes>
              <Route path="/" element={<Dashboard weeklySlate={demo} />} />
              <Route
                path="/parlays"
                element={
                  <Parlays parlays={demoParlays} setBalance={setBalance} />
                }
              />
            </Routes>
          </TasksDispatchContext>
        </TasksContext>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
