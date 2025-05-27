import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type { CreateTournamentRequest } from "../../domain/types";

export const useCreateTournament = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTournament = async (data: CreateTournamentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentsApi.createTournament(data);
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message || "Error al crear el torneo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createTournament, loading, error };
};
