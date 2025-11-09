import { Dashboard } from "./components/dashboard/Dashboard";
import "./App.css";
import { Navbar } from "./components/dashboard/nav/Navbar";
import { Parlays } from "./components/dashboard/parlays/Parlays";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import * as React from "react";
import { useEffect, useReducer } from "react";
import {
  TasksContext,
  TasksDispatchContext,
} from "./components/reducer/TasksContext";
import { ParlaySlipProps } from "./components/dashboard/parlays/Parlay";
import { generateId } from "./Util";
import { MatchupProps } from "./components/dashboard/wagers/Matchup";

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

export function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(true);
  const [balance, setBalance] = React.useState<number>(100);
  const [parlayLegs, setParlayLegs] = React.useState<ParlayTask[]>([]);
  const [parlays, setParlays] = React.useState<ParlaySlipProps[]>([]);
  const [currentParlay, setCurrentParlay] = React.useState<ParlayInfo>(null);

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
          id: "JASON's SQUADSPREAD BETTING",
          odds: -150,
          team: "JASON's SQUAD",
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
          id: "SEB's SQUAD-SPREAD BETTING",
          odds: -110,
          team: "SEB's SQUAD",
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
          id: "SEB's SQUAD-TOTAL POINTS",
          odds: -150,
          team: "SEB's SQUAD v JEFE's SQUAD",
          text: "O 3985.5",
        },
        {
          betType: "MONEYLINE",
          id: "SEB's SQUAD-MONEYLINE",
          odds: 200,
          team: "SEB's SQUAD",
          text: "",
        },
        {
          betType: "TOTAL POINTS",
          id: "JASON's SQUAD-TOTAL POINTS",
          odds: -120,
          team: "JASON's SQUAD v MICHAEL's SQUAD",
          text: "O 3785.5",
        },
        {
          betType: "MONEYLINE",
          id: "MICHAEL's SQUAD-MONEYLINE",
          odds: -120,
          team: "MICHAEL's SQUAD",
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
          id: "JORDAN's SQUAD-SPREAD BETTING",
          odds: -110,
          team: "JORDAN's SQUAD",
          text: "+35.5",
        },
        {
          betType: "TOTAL POINTS",
          id: "JARON's SQUAD-TOTAL POINTS",
          odds: 125,
          team: "JORDAN's SQUAD v JARON's SQUAD",
          text: "U 3985.5",
        },
        {
          betType: "TOTAL POINTS",
          id: "SEB's SQUAD-TOTAL POINTS",
          odds: -150,
          team: "SEB's SQUAD v JEFE's SQUAD",
          text: "O 3985.5",
        },
        {
          betType: "SPREAD BETTING",
          id: "MICHAEL's SQUAD-SPREAD BETTING",
          odds: -110,
          team: "MICHAEL's SQUAD",
          text: "-100.5",
        },
        {
          betType: "SPREAD BETTING",
          id: "SEB's SQUAD-SPREAD BETTING",
          odds: -110,
          team: "SEB's SQUAD",
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
            name: "SEB's SQUAD",
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
            name: "JEFE's SQUAD",
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
            name: "JASON's SQUAD",
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
            name: "MICHAEL's SQUAD",
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
            name: "JORDAN's SQUAD",
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
            name: "JARON's SQUAD",
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
      console.log(newParlay);
      setParlays([...parlays, newParlay]);
      setParlayLegs([]);
      setCurrentParlay(null);
    }
  }, [parlayLegs, currentParlay]);

  return (
    <Router>
      <TasksContext value={tasks}>
        <TasksDispatchContext value={dispatch}>
          <Navbar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            balance={balance}
            setBalance={setBalance}
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
    </Router>
  );
}

export default App;
