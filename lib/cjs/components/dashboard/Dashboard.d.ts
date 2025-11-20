import * as React from "react";
import { MatchupSchema } from "../../utils/Util";
export interface DashboardProps {
    weeklySlate: MatchupSchema[];
    setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
    lockout: boolean;
    setCurrentMatchup: React.Dispatch<React.SetStateAction<MatchupSchema>>;
}
export declare function Dashboard(props: DashboardProps): import("react/jsx-runtime").JSX.Element;
