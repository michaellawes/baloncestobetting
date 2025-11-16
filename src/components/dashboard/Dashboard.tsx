import { WeeklySlate } from "./wagers/WeeklySlate";
import * as React from "react";
import { useContext, useEffect } from "react";
import { MatchupSchema } from "../../utils/Util";
import { ParlayTask } from "../../App";
import { TasksContext } from "../reducer/TasksContext";

export interface DashboardProps {
  weeklySlate: MatchupSchema[];
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Dashboard(props: DashboardProps) {
  const { weeklySlate, setIsViewingDashboard } = props;
  const tasks: ParlayTask[] = useContext(TasksContext);

  useEffect(() => {
    setIsViewingDashboard(true);
  }, []);

  return (
    <div
      className={
        tasks.length > 0
          ? "w-full h-screen mb-20 bg-gray-900"
          : "w-full h-screen bg-gray-900"
      }
    >
      <WeeklySlate matchups={weeklySlate} />
    </div>
  );
}
