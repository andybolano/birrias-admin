import { useState } from "react";
import { teamsApi } from "../../infrastructure/api";

export const useDownloadPlayerTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teamsApi.downloadPlayerTemplate();

      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "plantilla-jugadores.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al descargar la plantilla";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    downloadTemplate,
    loading,
    error,
    clearError: () => setError(null),
  };
};
