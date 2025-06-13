import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type { FixturesResponse } from "../../domain/types";

export const useFixtures = (tournamentId: string) => {
  const [fixtures, setFixtures] = useState<FixturesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const response = await tournamentsApi.getFixtures(tournamentId);
      setFixtures(response.data);
      setError(null);
    } catch (err: unknown) {
      setError("Error al cargar los fixtures");
      console.error("Error fetching fixtures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchFixtures();
    }
  }, [tournamentId]);

  const refetch = () => {
    fetchFixtures();
  };

  return { fixtures, loading, error, refetch };
};
