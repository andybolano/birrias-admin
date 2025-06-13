import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

export const useRemoveTeamFromTournament = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeTeamFromTournament = async (
    tournamentId: string,
    teamId: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentsApi.removeTeamFromTournament(
        tournamentId,
        teamId
      );
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al eliminar el equipo del torneo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    removeTeamFromTournament,
    loading,
    error,
    clearError: () => setError(null),
  };
};
