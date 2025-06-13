import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";

interface MatchEventPlayer {
  id: string;
  name: string;
}

interface MatchEvent {
  id: string;
  type: "goal" | "yellow_card" | "red_card" | "blue_card" | "substitution";
  minute: number;
  description: string;
  player: MatchEventPlayer;
  substitute_player?: MatchEventPlayer;
  created_at: string;
}

export const useGetMatchEvents = (
  matchId: string,
  shouldFetch: boolean = false
) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await tournamentsApi.getMatchEvents(matchId);
      setEvents(response.data as MatchEvent[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los eventos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch && matchId) {
      fetchEvents();
    }
  }, [matchId, shouldFetch]);

  return { events, loading, error, refetch: fetchEvents };
};
