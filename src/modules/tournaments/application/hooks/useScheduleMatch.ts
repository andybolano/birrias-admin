import { useState } from "react";
import { tournamentsApi } from "../../infrastructure/api";

interface ScheduleMatchRequest {
  match_date: string;
  venue?: string;
}

export const useScheduleMatch = (matchId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheduleMatch = async (data: ScheduleMatchRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentsApi.scheduleMatch(matchId, data);
      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Error al programar el partido";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { scheduleMatch, loading, error };
};
