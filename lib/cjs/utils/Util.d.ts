import { SupabaseParlay } from "../components/parlays/Parlay";
import { ParlayTask } from "../App";
import { PropLineInterface } from "../components/dashboard/wagers/PropLine";
export declare const generateId: () => string;
export declare const oddsToDecimal: (value: number) => number;
export declare const decimalToOdds: (decimal: number) => number;
export declare const getUuid: (id: string) => string;
export interface Team {
    icon: string;
    name: string;
    record: string;
    color: string;
    spread: PropLineInterface;
    points: PropLineInterface;
    moneyline: PropLineInterface;
}
export interface MatchupSchema {
    road: Team;
    home: Team;
}
export declare const refactoredDemo: MatchupSchema[];
export declare const demoParlays: SupabaseParlay[];
export declare const propField: string[];
export declare const evaluateLeg: (leg: ParlayTask, event: number) => number | boolean;
