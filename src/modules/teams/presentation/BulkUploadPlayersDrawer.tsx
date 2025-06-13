import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Label } from "@/ui-lib/atoms/Label";
import { FileUpload } from "@/ui-lib/atoms/FileUpload";
import { useBulkUploadPlayers } from "../application/hooks/useBulkUploadPlayers";
import { useDownloadPlayerTemplate } from "../application/hooks/useDownloadPlayerTemplate";

interface BulkUploadPlayersDrawerProps {
  teamId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BulkUploadPlayersDrawer: React.FC<
  BulkUploadPlayersDrawerProps
> = ({ teamId, onSuccess, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { uploadPlayers, loading, error, clearError } = useBulkUploadPlayers();
  const {
    downloadTemplate,
    loading: downloadLoading,
    error: downloadError,
    clearError: clearDownloadError,
  } = useDownloadPlayerTemplate();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);

    // Debug: Log file information
    if (file) {
      console.log("Selected file:", {
        name: file.name,
        type: file.type,
        size: file.size,
        extension: file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf(".")),
      });
    }

    // Clear messages when user selects a new file
    if (error) clearError();
    if (successMessage) setSuccessMessage(null);
    if (downloadError) clearDownloadError();
    if (fileError) setFileError(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate();
    } catch (error) {
      // Error is handled by the hook
      console.error("Error downloading template:", error);
    }
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = [
      "text/csv",
      "application/csv",
      "text/comma-separated-values",
      "text/plain", // Some systems report CSV as text/plain
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    // Check file size first
    if (file.size > 5 * 1024 * 1024) {
      return {
        isValid: false,
        error: "El archivo es demasiado grande. Máximo 5MB permitido.",
      };
    }

    // For CSV files, prioritize extension over MIME type (more reliable)
    if (fileExtension === ".csv") {
      return { isValid: true };
    }

    // For Excel files, check both MIME type and extension
    if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      return { isValid: true };
    }

    // Fallback: check MIME type for any other cases
    if (allowedTypes.includes(file.type)) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: `Tipo de archivo no válido. Formatos soportados: ${allowedExtensions.join(
        ", "
      )}`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Por favor, selecciona un archivo");
      return;
    }

    const validation = validateFile(selectedFile);
    if (!validation.isValid) {
      setFileError(validation.error || "Archivo no válido");
      return;
    }

    // Clear any previous file errors
    setFileError(null);

    try {
      const response = await uploadPlayers(teamId, selectedFile);

      setSelectedFile(null);
      setSuccessMessage(
        `¡${
          response.data.players?.length || 0
        } jugadores cargados exitosamente desde el archivo!`
      );

      // Auto close drawer after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Error is handled by the hook
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    clearError();
    setSuccessMessage(null);
    clearDownloadError();
    setFileError(null);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Carga Masiva de Jugadores
        </h2>
        <p className="text-muted-foreground text-sm">
          Sube un archivo CSV con la información de múltiples jugadores para
          agregarlos al equipo
        </p>
      </div>

      {/* Template Download Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg
            className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Descarga la Plantilla
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Descarga la plantilla CSV con el formato correcto para cargar los
              jugadores.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              disabled={downloadLoading}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {downloadLoading ? (
                <>
                  <svg
                    className="h-4 w-4 mr-2 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Descargando...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M4 7h16"
                    />
                  </svg>
                  Descargar Plantilla CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Download Error */}
      {downloadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
          <p className="text-red-800 text-sm">{downloadError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="csv-file">Archivo CSV/Excel *</Label>
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".csv,.xlsx,.xls"
            maxSize={5}
            placeholder="Seleccionar archivo CSV o Excel con jugadores"
            className="mt-1"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Formatos soportados: .csv, .xlsx, .xls. Máximo 5MB.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Instrucciones:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>1. Descarga la plantilla CSV usando el botón de arriba</li>
            <li>2. Completa la información de los jugadores en la plantilla</li>
            <li>3. Guarda el archivo y súbelo usando el campo de arriba</li>
            <li>4. Todos los jugadores válidos serán agregados al equipo</li>
          </ul>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {fileError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{fileError}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || !selectedFile}>
            {loading ? "Procesando..." : "Cargar Jugadores"}
          </Button>
        </div>
      </form>
    </div>
  );
};
