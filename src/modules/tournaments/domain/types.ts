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

export interface CreateTournamentRequest {
  name: string;
  start_date: string;
  inscription_fee_money: number;
  currency: string;
  format: string;
  groups?: number;
  teams_per_group?: number;
  playoff_size?: number;
  rounds?: number;
  home_away?: boolean;
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
  teams: unknown[];
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
