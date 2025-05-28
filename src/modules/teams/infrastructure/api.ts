import { request } from "@/core/request";
import type {
  TeamsResponse,
  CreateTeamRequest,
  Team,
  CreatePlayerRequest,
  Player,
} from "../domain/types";

export const teamsApi = {
  getTeams: () => request.get<TeamsResponse>("/teams"),

  getTeam: (teamId: string) => request.get<Team>(`/teams/${teamId}`),

  createTeam: (data: CreateTeamRequest) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.shield) {
      formData.append("shield", data.shield);
    }

    return request.post<Team>("/teams", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  createPlayer: (data: CreatePlayerRequest) => {
    return request.post<Player>("/players", data);
  },
};
