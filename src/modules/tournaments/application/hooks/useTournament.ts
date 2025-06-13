import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type { Tournament } from "../../domain/types";

export const useTournament = (tournamentId: string) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const response = await tournamentsApi.getTournament(tournamentId);
      setTournament(response.data);
      setError(null);
    } catch (err: unknown) {
      setError("Error al cargar el torneo");
      console.error("Error fetching tournament:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  const refetch = () => {
    fetchTournament();
  };

  return { tournament, loading, error, refetch };
};
