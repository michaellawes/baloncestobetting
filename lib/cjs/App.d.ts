import "./App.css";
export interface ParlayTask {
    id: string;
    team: string;
    betType: string;
    text: string;
    odds: number;
}
export interface ParlayAction {
    type: string;
    id: string;
    text: string;
    odds: number;
    betType?: string;
    team?: string;
    oppId?: string;
    totalOdds?: number;
    payout?: number;
    wager?: number;
}
export interface ParlayInfo {
    totalOdds: number;
    payout: number;
    wager: number;
}
export declare function App(): import("react/jsx-runtime").JSX.Element;
export default App;
