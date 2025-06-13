import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

export const useAddTeamsToTournamentBulk = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTeamsToTournament = async (
    tournamentId: string,
    teamIds: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      await tournamentsApi.addTeamsToTournamentBulk(tournamentId, teamIds);
    } catch (err: unknown) {
      const errorMessage = "Error al agregar equipos al torneo";
      setError(errorMessage);
      console.error("Error adding teams to tournament:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addTeamsToTournament, loading, error };
};
