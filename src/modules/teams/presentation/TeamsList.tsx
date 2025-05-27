import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { useTeams } from "../application/hooks/useTeams";
import type { Team } from "../domain/types";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          {team.shield ? (
            <img
              src={team.shield}
              alt={`Escudo de ${team.name}`}
              className="h-16 w-16 object-cover rounded-full border-2 border-gray-200"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{team.name}</h3>
          <p className="text-sm text-gray-600">
            Creado: {formatDate(team.created_at)}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm">
          Ver Detalles
        </Button>
        <Button variant="default" size="sm">
          Gestionar
        </Button>
      </div>
    </div>
  );
};

export const TeamsList: React.FC = () => {
  const { teams, pagination, loading, error, refetch } = useTeams();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando equipos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay equipos registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Aún no has creado ningún equipo. ¡Crea tu primer equipo para
            comenzar!
          </p>
          <Button variant="default" onClick={() => navigate("/teams/create")}>
            Crear Primer Equipo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Equipos</h2>
          <p className="text-gray-600">
            {pagination ? (
              <>
                Mostrando {pagination.from} - {pagination.to} de{" "}
                {pagination.total} equipos
              </>
            ) : (
              <>
                {teams.length} equipo{teams.length !== 1 ? "s" : ""} registrado
                {teams.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={refetch}>
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {pagination && pagination.total > pagination.per_page && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <p className="text-sm text-gray-600">
            Página {pagination.current_page} de {pagination.last_page}
          </p>
        </div>
      )}
    </div>
  );
};
