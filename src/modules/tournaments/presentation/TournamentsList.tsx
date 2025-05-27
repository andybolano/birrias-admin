import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { useTournaments } from "../application/hooks/useTournaments";
import type { Tournament } from "../domain/types";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: string | number, currency: string) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(numericAmount);
};

const getFormatLabel = (format: string) => {
  const formatLabels: Record<string, string> = {
    league: "Liga Simple",
    league_playoffs: "Liga + Playoffs",
    groups_knockout: "Grupos + Eliminatorias",
  };
  return formatLabels[format] || format;
};

const getStatusLabel = (status: string) => {
  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: "Activo", color: "text-green-600 bg-green-100" },
    inactive: { label: "Inactivo", color: "text-gray-600 bg-gray-100" },
    completed: { label: "Completado", color: "text-blue-600 bg-blue-100" },
    cancelled: { label: "Cancelado", color: "text-red-600 bg-red-100" },
  };
  return (
    statusLabels[status] || {
      label: status,
      color: "text-gray-600 bg-gray-100",
    }
  );
};

const TournamentCard: React.FC<{ tournament: Tournament }> = ({
  tournament,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {tournament.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                getStatusLabel(tournament.status).color
              }`}
            >
              {getStatusLabel(tournament.status).label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Formato:</span>{" "}
            {getFormatLabel(tournament.format)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Fecha de inicio:</span>{" "}
            {formatDate(tournament.start_date)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(
              tournament.inscription_fee_money,
              tournament.currency
            )}
          </p>
          <p className="text-xs text-gray-500">Cuota de inscripción</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        {tournament.rounds && tournament.rounds > 0 && (
          <div>
            <span className="font-medium text-gray-700">Vueltas:</span>
            <span className="ml-1 text-gray-600">{tournament.rounds}</span>
          </div>
        )}
        {tournament.groups && tournament.groups > 0 && (
          <div>
            <span className="font-medium text-gray-700">Grupos:</span>
            <span className="ml-1 text-gray-600">{tournament.groups}</span>
          </div>
        )}
        {tournament.teams_per_group && tournament.teams_per_group > 0 && (
          <div>
            <span className="font-medium text-gray-700">
              Equipos por grupo:
            </span>
            <span className="ml-1 text-gray-600">
              {tournament.teams_per_group}
            </span>
          </div>
        )}
        {tournament.playoff_size && tournament.playoff_size > 0 && (
          <div>
            <span className="font-medium text-gray-700">Playoffs:</span>
            <span className="ml-1 text-gray-600">
              {tournament.playoff_size} equipos
            </span>
          </div>
        )}
        {tournament.home_away !== undefined && (
          <div>
            <span className="font-medium text-gray-700">Ida y vuelta:</span>
            <span className="ml-1 text-gray-600">
              {tournament.home_away ? "Sí" : "No"}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Creado: {formatDate(tournament.created_at)}
        </p>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
          <Button variant="default" size="sm">
            Gestionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export const TournamentsList: React.FC = () => {
  const { tournaments, pagination, loading, error, refetch } = useTournaments();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando torneos...
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

  if (tournaments.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay torneos registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Aún no has creado ningún torneo. ¡Crea tu primer torneo para
            comenzar!
          </p>
          <Button
            variant="default"
            onClick={() => navigate("/tournaments/create")}
          >
            Crear Primer Torneo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Torneos</h2>
          <p className="text-gray-600">
            {pagination ? (
              <>
                Mostrando {pagination.from} - {pagination.to} de{" "}
                {pagination.total} torneos
              </>
            ) : (
              <>
                {tournaments.length} torneo{tournaments.length !== 1 ? "s" : ""}{" "}
                registrado{tournaments.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={refetch}>
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
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
