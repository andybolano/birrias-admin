import { request } from "@/core/request";
import type {
  CreateTeamRequest,
  Team,
  CreatePlayerRequest,
  Player,
} from "../domain/types";

export const teamsApi = {
  getTeams: (all: boolean = false) => {
    const params = all ? { all: "true" } : {};
    return request.get<Team[]>("/teams", { params });
  },

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

  bulkUploadPlayers: (formData: FormData) => {
    return request.post<{ message: string; players: Player[] }>(
      "/players/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  downloadPlayerTemplate: () => {
    return request.get("/players/template", {
      responseType: "blob",
    });
  },
};
