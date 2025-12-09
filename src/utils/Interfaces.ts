import * as React from "react";

export interface AuthProps {
  isLoggedIn: boolean;
  profileImg: string;
}

export interface DashboardProps {
  weeklySlate: MatchupSchema[];
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
  lockout: boolean;
  setCurrentMatchup: React.Dispatch<React.SetStateAction<MatchupSchema>>;
  setMatchup: React.Dispatch<React.SetStateAction<number>>;
  setWeeklySlate: React.Dispatch<React.SetStateAction<MatchupSchema[]>>;
}

export interface ErrorLanderProps {
  message: string;
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

export interface LockoutProps {
  message: string;
}

export interface MatchupSchema {
  road: Team;
  home: Team;
  isClose: boolean;
  lastGame?: number;
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
  isViewingMatchup: boolean;
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
  is_winner?: boolean;
  parlay_modification_type?: string;
  expires_at?: string;
  legs?: ParlayTask[];
  special_leg_type?: string;
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
export interface ParlayProps extends SupabaseParlay {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  liveTeamData: Map<string, Map<string, string>>;
  livePlayerData: Map<string, string>;
  setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
}

export interface ParlayTask {
  frontend_id: string;
  team: string;
  text: string;
  odds: number;
  matchup_id: number;
  day_id: number;
  parlay_id: string;
  index?: number;
  did_hit?: boolean;
  live_value?: number;
  special_leg_type?: string;
}
export interface ParlaysViewerProps {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  user: UserData;
  balance: number;
  setParlayFieldUpdate: React.Dispatch<React.SetStateAction<ParlayFieldUpdate>>;
  setIsViewingDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewingMatchup: React.Dispatch<React.SetStateAction<boolean>>;
  matchups: MatchupSchema[];
  setNotification: React.Dispatch<React.SetStateAction<NotificationMetadata>>;
  matchup: number;
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
  last_game: string;
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
  isClose?: boolean;
  specialLegType?: string;
}

export interface SpecialsProps {
  matchup_id: number;
}

export interface SqlParlayMetadata {
  parlay_id: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  is_winner: boolean;
  wager: number;
  user_id: string;
  matchup_id: number;
  day_id: number;
  total_odds: number;
  payout: number;
}

export interface SqlPlayerLastGame {
  name: string;
  last_game: string;
}

export interface SqlPlayerMetadata {
  name: string;
  team: string;
  pos: string;
  status: string;
  matchup_id?: number;
  fantasy_team_name: string;
  avg: number;
  games_left: number;
  last_game?: string;
}

export interface SqlPropSlate {
  main_prop_id: string;
  main_prop_odds: number;
  matchup_id: number;
  point_value: number;
  prop_id: string;
  sub_prop_odds: number;
  live_value: number;
}

export interface SqlTeamMetadata {
  name: string;
  live_score: number;
  profile_url: string;
  wins: number;
  losses: number;
}

export interface SupabaseParlay {
  frontend_id?: string;
  user_id?: string;
  created_at?: string;
  expires_at?: string;
  parlay_id?: string;
  matchup_id?: number;
  total_odds?: number;
  payout?: number;
  wager?: number;
  is_winner?: boolean;
  is_active?: boolean;
  frontend_is_active?: boolean;
  legs?: ParlayTask[];
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
  first_last_game?: number;
}

export interface UserData {
  id: string;
  name: string;
  profile: string;
}
