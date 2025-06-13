import React from "react";
import { TournamentSchemaManager } from "./TournamentSchemaManager";
import { useTournamentSchema } from "../application/hooks/useTournamentSchema";
import type { TournamentSchema } from "../domain/types";

interface TournamentSchemaManagerWrapperProps {
  tournamentId: string;
}

export const TournamentSchemaManagerWrapper: React.FC<
  TournamentSchemaManagerWrapperProps
> = ({ tournamentId }) => {
  const { schema, loading, updating, error, updateSchema } =
    useTournamentSchema(tournamentId);

  const handleSchemaChange = async (newSchema: TournamentSchema) => {
    try {
      await updateSchema(newSchema);
    } catch (error) {
      console.error("Error updating schema:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando esquema del torneo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {updating && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800">Guardando cambios en el esquema...</p>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Esquema del Torneo
          </h3>
          <p className="text-sm text-gray-600">
            Configura las fases del torneo. El esquema debe estar definido antes
            de generar los fixtures.
          </p>
        </div>

        <TournamentSchemaManager
          schema={schema}
          onSchemaChange={handleSchemaChange}
        />
      </div>

      {schema.phases.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-green-800 font-medium">
              Esquema configurado con {schema.phases.length} fase
              {schema.phases.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Ahora puedes generar los fixtures desde la pestaña de Equipos.
          </p>
        </div>
      )}
    </div>
  );
};
