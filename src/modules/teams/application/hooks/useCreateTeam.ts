import { useState } from "react";
import { teamsApi } from "../../infrastructure/api";
import type { CreateTeamRequest } from "../../domain/types";

export const useCreateTeam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeam = async (data: CreateTeamRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamsApi.createTeam(data);
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al crear el equipo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createTeam, loading, error };
};
