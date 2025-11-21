import * as React from "react";
import { MatchupSchema, NotificationMetadata, ParlayFieldUpdate, UserData } from "../../utils/Interfaces";
export interface ParlaysViewerProps {
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    user: UserData;
    setParlayFieldUpdate: React.Dispatch<React.SetStateAction<ParlayFieldUpdate>>;
    setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
    setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
    matchups: MatchupSchema[];
    setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
}
export declare function Parlays(props: ParlaysViewerProps): import("react/jsx-runtime").JSX.Element;
