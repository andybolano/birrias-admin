import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type { TournamentPhaseType } from "../../domain/types";

export const useTournamentPhaseTypes = () => {
  const [phaseTypes, setPhaseTypes] = useState<TournamentPhaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhaseTypes = async () => {
      try {
        setLoading(true);
        const response = await tournamentsApi.getPhaseTypes();
        setPhaseTypes(response.data.phase_types);
        setError(null);
      } catch (err) {
        setError("Error al cargar los tipos de fases");
        console.error("Error fetching tournament phase types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhaseTypes();
  }, []);

  return { phaseTypes, loading, error };
};
