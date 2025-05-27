import { useState, useEffect } from "react";
import { teamsApi } from "../../infrastructure/api";
import type { Team, TeamsResponse } from "../../domain/types";

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState<Omit<
    TeamsResponse,
    "data"
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsApi.getTeams();
      setTeams(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        first_page_url: response.data.first_page_url,
        from: response.data.from,
        last_page: response.data.last_page,
        last_page_url: response.data.last_page_url,
        links: response.data.links,
        next_page_url: response.data.next_page_url,
        path: response.data.path,
        per_page: response.data.per_page,
        prev_page_url: response.data.prev_page_url,
        to: response.data.to,
        total: response.data.total,
      });
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

  return { teams, pagination, loading, error, refetch };
};
