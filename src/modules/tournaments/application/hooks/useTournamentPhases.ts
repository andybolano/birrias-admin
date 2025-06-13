import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type {
  TournamentPhaseResponse,
  CreateTournamentPhaseRequest,
  UpdateTournamentPhaseRequest,
} from "../../domain/types";

export const useTournamentPhases = (tournamentId: string) => {
  const [phases, setPhases] = useState<TournamentPhaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const response = await tournamentsApi.getTournamentPhases(tournamentId);

      // API returns direct array of phases
      const phasesData: TournamentPhaseResponse[] = Array.isArray(response.data)
        ? response.data
        : [];

      setPhases(phasesData);
      setError(null);
    } catch {
      // If phases don't exist, start with empty array
      setPhases([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const createPhase = async (phaseData: CreateTournamentPhaseRequest) => {
    try {
      setCreating(true);
      const response = await tournamentsApi.createTournamentPhase(
        tournamentId,
        phaseData
      );

      // Add the new phase to the list - ensure prev is always an array
      setPhases((prev) => {
        const currentPhases = Array.isArray(prev) ? prev : [];
        return [...currentPhases, response.data];
      });
      setError(null);
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al crear la fase del torneo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const updatePhase = async (
    phaseId: string,
    phaseData: UpdateTournamentPhaseRequest
  ) => {
    try {
      setUpdating(true);
      const response = await tournamentsApi.updateTournamentPhase(
        tournamentId,
        phaseId,
        phaseData
      );

      // Update the phase in the list
      setPhases((prev) => {
        const currentPhases = Array.isArray(prev) ? prev : [];
        return currentPhases.map((phase) =>
          phase.id === phaseId ? response.data : phase
        );
      });
      setError(null);
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al actualizar la fase del torneo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const generateFixtures = async (phaseId: string) => {
    try {
      await tournamentsApi.generatePhaseFixtures(tournamentId, phaseId);
      // Refresh phases to get updated match counts
      await fetchPhases();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al generar fixtures de la fase";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchPhases();
    }
  }, [tournamentId]);

  return {
    phases,
    loading,
    creating,
    updating,
    error,
    createPhase,
    updatePhase,
    generateFixtures,
    refetch: fetchPhases,
  };
};
