import { WeeklySlateProps, WeeklySlate } from "./wagers/WeeklySlate";
import { PropLineInterface } from "./wagers/PropLine";
import { LiveParlayViewer } from "./parlays/LiveParlayViewer";
import * as React from "react";

export interface DashboardProps {
    weeklySlate: WeeklySlateProps
    legs: PropLineInterface[],
    setLegs: React.Dispatch<React.SetStateAction<PropLineInterface[]>>
}

export function Dashboard(props: DashboardProps) {
    const { weeklySlate, legs, setLegs } = props;
    return (
        <div className="w-full">
            <WeeklySlate {...weeklySlate} />
            <nav>
                <LiveParlayViewer legs={legs} setLegs={setLegs} />
            </nav>
        </div>
    )
}