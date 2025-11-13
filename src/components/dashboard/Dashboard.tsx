import { WeeklySlate } from "./wagers/WeeklySlate";
import * as React from "react";
import { MatchupSchema } from "../../utils/Util";

export interface DashboardProps {
  weeklySlate: MatchupSchema[];
}

export function Dashboard(props: DashboardProps) {
  return (
    <div className={"w-full mb-20"}>
      <WeeklySlate matchups={props.weeklySlate} />
    </div>
  );
}
