import "./App.css";
import { SupabaseParlay } from "./components/parlays/Parlay";
export interface ParlayTask {
    frontend_id: string;
    team: string;
    betType: string;
    text: string;
    odds: number;
}
export interface ParlayAction {
    type: string;
    frontend_id?: string;
    text?: string;
    odds?: number;
    betType?: string;
    team?: string;
    oppId?: string;
    totalOdds?: number;
    payout?: number;
    wager?: number;
    user_id?: string;
    parlay_id?: string;
    is_payed_out?: boolean;
    is_winner?: boolean;
    parlay_modification_type?: string;
    slip?: Slip;
}
export interface ParlayInfo {
    totalOdds: number;
    payout: number;
    wager: number;
}
export interface UserData {
    id: string;
    name: string;
    profile: string;
}
export interface ParlayFieldUpdate {
    user_id: string;
    parlay_id: string;
    parlay_modification_type: string;
    parlay?: SupabaseParlay;
}
export interface Slip {
    legs: ParlayTask[];
    matchup_id: string;
    parlay_id: string;
    user_id: string;
    payout: number;
}
export declare function App(): import("react/jsx-runtime").JSX.Element;
export default App;
