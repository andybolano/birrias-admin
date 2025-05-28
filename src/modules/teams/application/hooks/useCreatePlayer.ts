import { useState } from "react";
import { teamsApi } from "../../infrastructure/api";
import type { CreatePlayerRequest } from "../../domain/types";

export const useCreatePlayer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlayer = async (data: CreatePlayerRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamsApi.createPlayer(data);
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al crear el jugador";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createPlayer, loading, error };
};
