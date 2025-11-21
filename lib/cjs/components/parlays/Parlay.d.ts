import * as React from "react";
import { NotificationMetadata, ParlayTask } from "../../utils/Interfaces";
export interface SupabaseParlay {
    frontend_id?: string;
    user_id: string;
    created_at: number;
    expires_at: number;
    parlay_id: string;
    matchup_id: number;
    total_odds: number;
    payout: number;
    wager: number;
    is_winner: boolean;
    is_payed_out: boolean;
    frontend_is_active: boolean;
    legs: ParlayTask[];
}
export interface ParlayProps extends SupabaseParlay {
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    liveTeamData: Map<string, Map<string, string>>;
    setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
}
export declare function Parlay(props: ParlayProps): import("react/jsx-runtime").JSX.Element;
