import { request } from "@/core/request";
import type {
  TournamentFormatsResponse,
  TournamentPhaseTypesResponse,
  CreateTournamentRequest,
  CreateTournamentPhaseRequest,
  UpdateTournamentPhaseRequest,
  TournamentPhaseResponse,
  UpdateTournamentSchemaRequest,
  TournamentSchemaResponse,
  Tournament,
  TournamentsResponse,
  FixturesResponse,
} from "../domain/types";

export const tournamentsApi = {
  getFormats: () =>
    request.get<TournamentFormatsResponse>("/tournaments/formats"),

  getPhaseTypes: () =>
    request.get<TournamentPhaseTypesResponse>("/tournament-phase-types"),

  createTournament: (data: CreateTournamentRequest) =>
    request.post<Tournament>("/tournaments", data),

  getTournaments: () => request.get<TournamentsResponse>("/tournaments"),

  getTournament: (tournamentId: string) =>
    request.get<Tournament>(`/tournaments/${tournamentId}`),

  // Tournament Phases Management
  getTournamentPhases: (tournamentId: string) =>
    request.get<TournamentPhaseResponse[]>(
      `/tournaments/${tournamentId}/phases`
    ),

  createTournamentPhase: (
    tournamentId: string,
    data: CreateTournamentPhaseRequest
  ) =>
    request.post<TournamentPhaseResponse>(
      `/tournaments/${tournamentId}/phases`,
      data
    ),

  updateTournamentPhase: (
    tournamentId: string,
    phaseId: string,
    data: UpdateTournamentPhaseRequest
  ) =>
    request.put<TournamentPhaseResponse>(
      `/tournaments/${tournamentId}/phases/${phaseId}`,
      data
    ),

  generatePhaseFixtures: (tournamentId: string, phaseId: string) =>
    request.post(
      `/tournaments/${tournamentId}/phases/${phaseId}/generate-fixtures`
    ),

  // Tournament Schema Management (Legacy - for backward compatibility)
  getTournamentSchema: (tournamentId: string) =>
    request.get<TournamentSchemaResponse>(
      `/tournaments/${tournamentId}/schema`
    ),

  updateTournamentSchema: (
    tournamentId: string,
    data: UpdateTournamentSchemaRequest
  ) =>
    request.put<TournamentSchemaResponse>(
      `/tournaments/${tournamentId}/schema`,
      data
    ),

  addTeamToTournament: (tournamentId: string, teamId: string) =>
    request.post(`/tournaments/${tournamentId}/teams`, { team_id: teamId }),

  addTeamsToTournamentBulk: (tournamentId: string, teamIds: string[]) =>
    request.post(`/tournaments/${tournamentId}/teams/bulk`, {
      team_ids: teamIds,
    }),

  removeTeamFromTournament: (tournamentId: string, teamId: string) =>
    request.delete(`/tournaments/${tournamentId}/teams`, {
      data: { team_id: teamId },
    }),

  generateFixtures: (tournamentId: string) =>
    request.post(`/tournaments/${tournamentId}/generate-fixtures`),

  getFixtures: (tournamentId: string) => {
    return request.get<FixturesResponse>(
      `/tournaments/${tournamentId}/fixtures`
    );
  },

  scheduleMatch: (
    matchId: string,
    data: { match_date: string; venue?: string }
  ) => request.patch(`/api/matches/${matchId}/schedule`, data),

  registerLineup: (
    matchId: string,
    data: {
      team_id: string;
      players: Array<{
        player_id: string;
        is_starter: boolean;
        shirt_number: number;
      }>;
    }
  ) => request.post(`/matches/${matchId}/lineups`, data),

  addMatchEvent: (
    matchId: string,
    data: {
      player_id: string;
      type: "goal" | "yellow_card" | "red_card" | "blue_card";
      minute?: number;
      description?: string;
    }
  ) => request.post(`/matches/${matchId}/events`, data),

  getMatchLineups: (matchId: string) =>
    request.get(`/matches/${matchId}/lineups`),

  getMatchEvents: (matchId: string) =>
    request.get(`/matches/${matchId}/events`),

  addMatchSubstitution: (
    matchId: string,
    data: { player_out_id: string; player_in_id: string; minute: number }
  ) => request.post(`/matches/${matchId}/substitutions`, data),
};
