import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

export const useGenerateFixtures = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFixtures = async (tournamentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await tournamentsApi.generateFixtures(tournamentId);
    } catch (err: unknown) {
      const errorMessage = "Error al generar los fixtures del torneo";
      setError(errorMessage);
      console.error("Error generating fixtures:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateFixtures, loading, error };
};
