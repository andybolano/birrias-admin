import { useState } from "react";
import { teamsApi } from "../../infrastructure/api";

export const useBulkUploadPlayers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPlayers = async (teamId: string, file: File) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("team_id", teamId);

      console.log("Uploading players:", {
        teamId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      const response = await teamsApi.bulkUploadPlayers(formData);

      console.log("Upload response:", response);

      return response;
    } catch (err: unknown) {
      console.error("Upload error:", err);

      let errorMessage = "Error al procesar el archivo";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const apiError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMessage =
          apiError.response?.data?.message || apiError.message || errorMessage;
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadPlayers,
    loading,
    error,
    clearError: () => setError(null),
  };
};
