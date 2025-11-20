import { MatchupSchema } from "../../utils/Util";
import * as React from "react";
export interface MatchupsProps {
    matchup: MatchupSchema;
    setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare function Matchup(props: MatchupsProps): import("react/jsx-runtime").JSX.Element;
