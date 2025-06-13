import type { Team } from "@/modules/teams/domain/types";

export interface TournamentFormat {
  value: string;
  label: string;
  description: string;
  required_params: string[];
  optional_params: string[];
  ignored_params: string[];
}

export interface TournamentFormatsResponse {
  formats: TournamentFormat[];
}

export interface TournamentPhaseType {
  value: string;
  label: string;
  description: string;
  supports_home_away: boolean;
  required_fields: string[];
  optional_fields: string[];
  config_options: Record<string, string>;
}

export interface TournamentPhaseTypesResponse {
  phase_types: TournamentPhaseType[];
}

export interface TournamentPhase {
  id?: string;
  name: string;
  type: string;
  order: number;
  config: Record<string, string | number | boolean>;
  home_away?: boolean;
  teams_advance?: number;
  groups_count?: number;
  teams_per_group?: number;
  is_active?: boolean;
  is_completed?: boolean;
}

export interface CreateTournamentPhaseRequest {
  name: string;
  type: string;
  home_away?: boolean;
  teams_advance?: number;
  groups_count?: number;
  teams_per_group?: number;
  config?: Record<string, string | number | boolean>;
}

export interface UpdateTournamentPhaseRequest {
  name: string;
  type: string;
  home_away?: boolean;
  teams_advance?: number;
  groups_count?: number;
  teams_per_group?: number;
  config?: Record<string, string | number | boolean>;
}

export interface TournamentPhaseResponse {
  id: string;
  tournament_id: string;
  phase_number: number;
  name: string;
  type: string;
  config: Record<string, string | number | boolean>;
  home_away: boolean;
  teams_advance?: number;
  groups_count?: number;
  teams_per_group?: number;
  is_active: boolean;
  is_completed: boolean;
  order: number;
  matches_count?: number;
}

export interface TournamentPhasesResponse {
  phases: TournamentPhaseResponse[];
}

export interface TournamentSchema {
  phases: TournamentPhase[];
}

export interface UpdateTournamentSchemaRequest {
  schema: TournamentSchema;
}

export interface TournamentSchemaResponse {
  tournament_id: string;
  schema: TournamentSchema;
}

export interface CreateTournamentRequest {
  name: string;
  start_date: string;
  inscription_fee_money: number;
  currency: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: string;
}

export interface TournamentTeam {
  id: string;
  name: string;
  shield?: string;
  // Otros campos que pueda tener el equipo en el contexto del torneo
}

export interface MatchTeam {
  id: string;
  name: string;
  shield?: string;
}

export interface Match {
  id: string;
  round: number;
  group_number: number | null;
  match_type: string;
  home_team: MatchTeam;
  away_team: MatchTeam;
  match_date: string | null;
  venue: string | null;
  stream_url: string | null;
  status: string;
  home_score: number;
  away_score: number;
  created_at: string;
  updated_at: string;
}

export interface Round {
  round: number;
  matches_count: number;
  matches: Match[];
}

export interface FixturesPhase {
  phase_id: string;
  phase_name: string;
  phase_type: string | null;
  phase_number: number;
  total_matches: number;
  total_rounds: number;
  rounds: Round[];
}

export interface FixturesResponse {
  tournament_id: string;
  tournament_name: string;
  format: string;
  total_matches: number;
  total_phases: number;
  phases: FixturesPhase[];
}

export interface Tournament {
  id: string;
  name: string;
  start_date: string;
  inscription_fee_money: string;
  currency: string;
  owner: User;
  status: string;
  format: string;
  groups?: number | null;
  teams_per_group?: number | null;
  playoff_size?: number | null;
  rounds?: number | null;
  home_away?: boolean;
  created_at: string;
  updated_at: string;
  teams: Team[];
  matches: unknown[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface TournamentsResponse {
  current_page: number;
  data: Tournament[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
