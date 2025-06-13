import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

export const useAddTeamToTournament = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTeamToTournament = async (tournamentId: string, teamId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentsApi.addTeamToTournament(
        tournamentId,
        teamId
      );
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al agregar el equipo al torneo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    addTeamToTournament,
    loading,
    error,
    clearError: () => setError(null),
  };
};
