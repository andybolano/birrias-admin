import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";

interface LineupPlayer {
  player_id: string;
  player_name: string;
  shirt_number: number;
}

interface TeamLineup {
  team_id: string;
  team_name: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

interface MatchLineups {
  home_team: TeamLineup;
  away_team: TeamLineup;
}

export const useMatchLineups = (
  matchId: string,
  shouldFetch: boolean = false
) => {
  const [lineups, setLineups] = useState<MatchLineups | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLineups = async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await tournamentsApi.getMatchLineups(matchId);
      setLineups(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las alineaciones"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch && matchId) {
      fetchLineups();
    }
  }, [matchId, shouldFetch]);

  return { lineups, loading, error, refetch: fetchLineups };
};
