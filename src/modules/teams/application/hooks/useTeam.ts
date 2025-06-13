import { useState, useEffect } from "react";
import { teamsApi } from "../../infrastructure/api";
import type { Team } from "../../domain/types";

export const useTeam = (teamId: string) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = async () => {
    if (!teamId) {
      setTeam(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await teamsApi.getTeam(teamId);
      setTeam(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el equipo"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  return { team, loading, error, refetch: fetchTeam };
};
