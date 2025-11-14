import { WeeklySlate } from "./wagers/WeeklySlate";
import * as React from "react";
import { useContext } from "react";
import { MatchupSchema } from "../../utils/Util";
import { ParlayTask } from "../../App";
import { TasksContext } from "../reducer/TasksContext";

export interface DashboardProps {
  weeklySlate: MatchupSchema[];
}

export function Dashboard(props: DashboardProps) {
  const tasks: ParlayTask[] = useContext(TasksContext);
  return (
    <div className={tasks.length > 0 ? "w-full h-full mb-20" : "h-full w-full"}>
      <WeeklySlate matchups={props.weeklySlate} />
    </div>
  );
}
