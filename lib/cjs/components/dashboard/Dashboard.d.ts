import * as React from "react";
import { MatchupSchema } from "../../utils/Interfaces";
export interface DashboardProps {
    weeklySlate: MatchupSchema[];
    setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
    setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
    lockout: boolean;
    setCurrentMatchup: React.Dispatch<React.SetStateAction<MatchupSchema>>;
    setMatchup: React.Dispatch<React.SetStateAction<number>>;
    setLockout: React.Dispatch<React.SetStateAction<boolean>>;
    setWeeklySlate: React.Dispatch<React.SetStateAction<MatchupSchema[]>>;
}
export declare function Dashboard(props: DashboardProps): import("react/jsx-runtime").JSX.Element;
