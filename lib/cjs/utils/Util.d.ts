import { SupabaseParlay } from "../components/parlays/Parlay";
import { ParlayTask } from "../App";
import { PropLineInterface } from "../components/dashboard/wagers/PropLine";
export declare const generateId: () => string;
export declare const oddsToDecimal: (value: number) => number;
export declare const decimalToOdds: (decimal: number) => number;
export declare const getUuid: (id: string) => string;
export interface Player {
    name: string;
    team: string;
    status: string;
    average: number;
    games_left: number;
    live_total: number;
    position: string;
}
export interface PropLineMetadata extends PropLineInterface {
    live_value: string;
}
export interface IndividualLineMetadata {
    text: string;
    over_odds: number;
    under_odds: number;
}
export interface Team {
    icon: string;
    name: string;
    record: string;
    spread: PropLineMetadata;
    points: PropLineMetadata;
    moneyline: PropLineMetadata;
    live_score: number;
    team_total: IndividualLineMetadata;
    top_5: Player[];
}
export interface MatchupSchema {
    road: Team;
    home: Team;
}
export declare const getSuffix: (rank: number) => "th" | "st" | "nd" | "rd";
export declare const numberWithCommas: (x: number) => string;
export declare const getParlayType: (numberOfLegs: number) => "Same Game Parlay" | "Same Game Parlay+";
export declare const getParlayTypeAbbreviated: (numberOfLegs: number) => "SGP" | "SGP+";
export declare const refactoredDemo: MatchupSchema[];
export declare const demoParlays: SupabaseParlay[];
export declare const propField: string[];
export declare const evaluateLeg: (leg: ParlayTask, event: number) => boolean;
export declare const getPropTextWithRespectToScreenSize: (leg: ParlayTask, screenWidth: number) => string;
export declare const round5: (x: number) => number;
export declare const progressBarWidth: Map<string, string>;
