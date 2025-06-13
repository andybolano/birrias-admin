import { useState, useEffect } from "react";
import { tournamentsApi } from "../../infrastructure/api";
import type {
  TournamentSchema,
  UpdateTournamentSchemaRequest,
} from "../../domain/types";

export const useTournamentSchema = (tournamentId: string) => {
  const [schema, setSchema] = useState<TournamentSchema>({ phases: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchema = async () => {
    try {
      setLoading(true);
      const response = await tournamentsApi.getTournamentSchema(tournamentId);
      setSchema(response.data.schema);
      setError(null);
    } catch {
      // If schema doesn't exist, start with empty schema
      setSchema({ phases: [] });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const updateSchema = async (newSchema: TournamentSchema) => {
    try {
      setUpdating(true);
      const requestData: UpdateTournamentSchemaRequest = {
        schema: newSchema,
      };
      const response = await tournamentsApi.updateTournamentSchema(
        tournamentId,
        requestData
      );
      setSchema(response.data.schema);
      setError(null);
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al actualizar el esquema del torneo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchSchema();
    }
  }, [tournamentId]);

  return {
    schema,
    loading,
    updating,
    error,
    updateSchema,
    refetch: fetchSchema,
  };
};
