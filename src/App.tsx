import { Dashboard } from "./components/dashboard/Dashboard";
import "./App.css";
import { Navbar } from "./components/dashboard/nav/Navbar";
import { Parlays } from "./components/dashboard/parlays/Parlays";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PropLineInterface } from "./components/dashboard/wagers/PropLine";
import * as React from "react";
import { useEffect, useReducer } from "react";
import {
  TasksContext,
  TasksDispatchContext,
} from "./components/reducer/TasksContext";
import { ParlayProps } from "./components/dashboard/parlays/Parlay";
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
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [balance, setBalance] = React.useState<number>(100);
  const [parlayLegs, setParlayLegs] = React.useState<ParlayTask[]>([]);
  const [parlays, setParlays] = React.useState<ParlayProps[]>([]);
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
      const legs: PropLineInterface[] = parlayLegs.map((parlay) => {
        return { odds: parlay.odds, text: parlay.text };
      });
      const newParlay: ParlayProps = {
        id: generateId(),
        timestamp: Date.now(),
        legs: legs,
        totalOdds: currentParlay.totalOdds,
        payout: currentParlay.payout,
        wager: currentParlay.wager,
        isActive: false,
        isWinner: false,
        isPayedOut: false,
      };
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
            <Route path="/parlays" element={<Parlays parlays={parlays} />} />
          </Routes>
        </TasksDispatchContext>
      </TasksContext>
    </Router>
  );
}

export default App;
