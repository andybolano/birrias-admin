import type { Tournament } from "../domain/types";

interface TournamentDetailsProps {
  tournament: Tournament;
}

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

export const TournamentDetails = ({ tournament }: TournamentDetailsProps) => {
  const statusInfo = getStatusLabel(tournament.status);

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{tournament.name}</h1>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Basic Information */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Información General</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Formato:</span>
            <span className="font-medium">
              {getFormatLabel(tournament.format)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha de inicio:</span>
            <span className="font-medium">
              {formatDate(tournament.start_date)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cuota de inscripción:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(
                tournament.inscription_fee_money,
                tournament.currency
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Organizador:</span>
            <span className="font-medium">
              {tournament.owner.name || tournament.owner.email}
            </span>
          </div>
        </div>
      </div>

      {/* Tournament Configuration */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Configuración del Torneo</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {tournament.rounds && tournament.rounds > 0 && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Vueltas</span>
              <span className="font-medium">{tournament.rounds}</span>
            </div>
          )}
          {tournament.groups && tournament.groups > 0 && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Grupos</span>
              <span className="font-medium">{tournament.groups}</span>
            </div>
          )}
          {tournament.teams_per_group && tournament.teams_per_group > 0 && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Equipos por grupo</span>
              <span className="font-medium">{tournament.teams_per_group}</span>
            </div>
          )}
          {tournament.playoff_size && tournament.playoff_size > 0 && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Playoffs</span>
              <span className="font-medium">
                {tournament.playoff_size} equipos
              </span>
            </div>
          )}
          {tournament.home_away !== undefined && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Ida y vuelta</span>
              <span className="font-medium">
                {tournament.home_away ? "Sí" : "No"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Estadísticas</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Equipos inscritos</span>
            <span className="font-medium">{tournament.teams?.length || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Partidos jugados</span>
            <span className="font-medium">
              {tournament.matches?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
