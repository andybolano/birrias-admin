export interface Team {
  id: string;
  name: string;
  shield?: string;
  created_at: string;
  updated_at: string;
  players?: Player[];
  tournaments?: unknown[];
}

export interface CreateTeamRequest {
  name: string;
  shield?: File;
}

export interface Player {
  id: string;
  position: string;
  jersey: number;
  birthDay: string;
  first_name: string;
  last_name: string;
  identification_number: string;
  eps: string;
  team_id: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    team_id: string;
    player_id: string;
    id: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CreatePlayerRequest {
  position: string;
  jersey: number;
  birthDay: string;
  first_name: string;
  last_name: string;
  identification_number: string;
  eps: string;
  team_id: string;
}

export interface TeamsResponse {
  current_page: number;
  data: Team[];
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

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

