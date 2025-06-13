import { useState, useEffect } from "react";
import { teamsApi } from "../../infrastructure/api";
import type { Team } from "../../domain/types";

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsApi.getTeams(true);
      setTeams(response.data);
      setError(null);
    } catch (err: unknown) {
      setError("Error al cargar los equipos");
      console.error("Error fetching teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const refetch = () => {
    fetchTeams();
  };

  return { teams, loading, error, refetch };
};
