import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type { TournamentFormat } from "../../domain/types";

export const useTournamentFormats = () => {
  const [formats, setFormats] = useState<TournamentFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormats = async () => {
      try {
        setLoading(true);
        const response = await tournamentsApi.getFormats();
        setFormats(response.data.formats);
        setError(null);
      } catch (err) {
        setError("Error al cargar los formatos de torneo");
        console.error("Error fetching tournament formats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormats();
  }, []);

  return { formats, loading, error };
};
