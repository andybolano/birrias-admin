import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type { Tournament, TournamentsResponse } from "../../domain/types";

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pagination, setPagination] = useState<Omit<
    TournamentsResponse,
    "data"
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await tournamentsApi.getTournaments();
      setTournaments(response.data.data);
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
      setError("Error al cargar los torneos");
      console.error("Error fetching tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const refetch = () => {
    fetchTournaments();
  };

  return { tournaments, pagination, loading, error, refetch };
};
