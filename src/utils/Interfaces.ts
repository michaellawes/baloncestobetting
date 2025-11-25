import * as React from "react";
import { SupabaseParlay } from "../components/parlays/Parlay";

export interface AuthProps {
  isLoggedIn: boolean;
  profileImg: string;
}

export interface IndividualLineMetadata {
  text: string;
  over_odds: number;
  under_odds: number;
}

export interface LiveParlayViewerProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  isLoggedIn: boolean;
}

export interface MatchupSchema {
  road: Team;
  home: Team;
}

export interface MatchupsProps {
  matchup: MatchupSchema;
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  isViewingDashboard: boolean;
  matchup: number;
}

export interface NotificationMetadata {
  show: boolean;
  legs: number;
  message: string;
  type: string;
}

export interface NotificationProps {
  notification: NotificationMetadata;
  setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
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
  isHome?: boolean;
  user_id?: string;
  parlay_id?: string;
  is_payed_out?: boolean;
  is_winner?: boolean;
  parlay_modification_type?: string;
  expires_at?: number;
  legs?: ParlayTask[];
}

export interface ParlayFieldUpdate {
  user_id: string;
  parlay_id: string;
  parlay_modification_type: string;
  parlay?: SupabaseParlay;
  payout?: number;
}

export interface ParlayInfo {
  totalOdds: number;
  payout: number;
  wager: number;
}

export interface ParlayTask {
  frontend_id: string;
  team: string;
  betType: string;
  text: string;
  odds: number;
  didHit?: boolean;
  lastValue?: number;
}

export interface Player {
  name: string;
  team: string;
  status: string;
  average: number;
  games_left: number;
  live_total: number;
  position: string;
  prop_line: IndividualLineMetadata;
}

export interface PropLineInterface {
  text: string;
  odds: number;
}

export interface PropLineMetadata extends PropLineInterface {
  live_value: string;
}

export interface PropLineProps {
  text: string;
  team: string;
  betType: string;
  odds: number;
  frontend_id: string;
  oppId: string;
  isHome?: boolean;
}

export interface SqlPropSlate {
  day_id: number;
  main_prop_id: string;
  main_prop_odds: number;
  matchup_id: number;
  point_value: number;
  prop_id: string;
  sub_prop_id: string;
  sub_prop_odds: number;
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

export interface UserData {
  id: string;
  name: string;
  profile: string;
}
