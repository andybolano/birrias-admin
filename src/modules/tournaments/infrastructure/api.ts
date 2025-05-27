import { request } from "@/core/request";
import type {
  TournamentFormatsResponse,
  CreateTournamentRequest,
  Tournament,
  TournamentsResponse,
} from "../domain/types";

export const tournamentsApi = {
  getFormats: () =>
    request.get<TournamentFormatsResponse>("/tournaments/formats"),

  createTournament: (data: CreateTournamentRequest) =>
    request.post<Tournament>("/tournaments", data),

  getTournaments: () => request.get<TournamentsResponse>("/tournaments"),
};
