import { useState, useEffect } from "react";
import { teamsApi } from "../../infrastructure/api";
import type { Team } from "../../domain/types";

export const useTeam = (teamId: string) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await teamsApi.getTeam(teamId);
      setTeam(response.data);
      setError(null);
    } catch (err: unknown) {
      setError("Error al cargar el equipo");
      console.error("Error fetching team:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeam();
    }
  }, [teamId]);

  const refetch = () => {
    if (teamId) {
      fetchTeam();
    }
  };

  return { team, loading, error, refetch };
};
