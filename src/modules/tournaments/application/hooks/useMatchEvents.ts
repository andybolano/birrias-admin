import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

interface MatchEvent {
  player_id: string;
  type: "goal" | "yellow_card" | "red_card" | "blue_card";
  minute?: number;
  description?: string;
}

export const useMatchEvents = (matchId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEvent = async (event: MatchEvent) => {
    try {
      setLoading(true);
      setError(null);
      await tournamentsApi.addMatchEvent(matchId, event);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar el evento"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addEvent, loading, error };
};
