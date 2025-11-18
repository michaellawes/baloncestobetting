import * as React from "react";
import { ParlayFieldUpdate, UserData } from "../../App";
import { MatchupSchema } from "../../utils/Util";
export interface ParlaysViewerProps {
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    user: UserData;
    setParlayFieldUpdate: React.Dispatch<React.SetStateAction<ParlayFieldUpdate>>;
    setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
    matchups: MatchupSchema[];
}
export declare function Parlays(props: ParlaysViewerProps): import("react/jsx-runtime").JSX.Element;
