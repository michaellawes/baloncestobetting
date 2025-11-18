import * as React from "react";
import { MatchupSchema } from "../../utils/Util";
export interface DashboardProps {
    weeklySlate: MatchupSchema[];
    setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
    lockout: boolean;
}
export declare function Dashboard(props: DashboardProps): import("react/jsx-runtime").JSX.Element;
