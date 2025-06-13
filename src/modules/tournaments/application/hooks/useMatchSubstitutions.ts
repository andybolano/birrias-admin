import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

interface SubstitutionRequest {
  player_out_id: string;
  player_in_id: string;
  minute: number;
}

export const useMatchSubstitutions = (matchId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSubstitution = async (substitution: SubstitutionRequest) => {
    try {
      setLoading(true);
      setError(null);
      await tournamentsApi.addMatchSubstitution(matchId, substitution);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar la sustitución"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addSubstitution, loading, error };
};
