import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

interface RegisterLineupRequest {
  team_id: string;
  players: Array<{
    player_id: string;
    is_starter: boolean;
    shirt_number: number;
  }>;
}

export const useRegisterLineup = (matchId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerLineup = async (data: RegisterLineupRequest) => {
    try {
      setLoading(true);
      setError(null);
      await tournamentsApi.registerLineup(matchId, data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar la alineación"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerLineup, loading, error };
};
