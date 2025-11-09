import { WeeklySlate } from "./wagers/WeeklySlate";
import * as React from "react";
import { useContext } from "react";
import { MatchupProps } from "./wagers/Matchup";
import { ParlayTask } from "../../App";
import { TasksContext } from "../reducer/TasksContext";

export interface DashboardProps {
  weeklySlate: MatchupProps[];
}

export function Dashboard(props: DashboardProps) {
  const tasks: ParlayTask[] = useContext(TasksContext);
  const { weeklySlate } = props;
  return (
    <div className={tasks.length > 0 ? "w-full mb-16" : "w-full"}>
      <WeeklySlate matchups={weeklySlate} />
    </div>
  );
}
