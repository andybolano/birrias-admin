import { request } from "@/core/request";
import type { TeamsResponse, CreateTeamRequest, Team } from "../domain/types";

export const teamsApi = {
  getTeams: () => request.get<TeamsResponse>("/teams"),

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
};
