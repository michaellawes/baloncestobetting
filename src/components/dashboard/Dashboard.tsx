import { WeeklySlate } from "./wagers/WeeklySlate";
import * as React from "react";
import { useContext } from "react";
import { ParlayTask } from "../../App";
import { TasksContext } from "../reducer/TasksContext";
import { MatchupSchema } from "../../utils/Util";

export interface DashboardProps {
  weeklySlate: MatchupSchema[];
}

export function Dashboard(props: DashboardProps) {
  const tasks: ParlayTask[] = useContext(TasksContext);
  return (
    <div className={tasks.length > 0 ? "w-full mb-16" : "w-full"}>
      <WeeklySlate matchups={props.weeklySlate} />
    </div>
  );
}
