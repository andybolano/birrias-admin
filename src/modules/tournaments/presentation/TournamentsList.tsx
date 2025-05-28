import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { DrawerWrapper as Drawer } from "@/ui-lib/atoms/DrawerWrapper";
import { useTournaments } from "../application/hooks/useTournaments";
import { TournamentDetails } from "./TournamentDetails";
import type { Tournament } from "../domain/types";

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

const TournamentCard: React.FC<{
  tournament: Tournament;
  onViewDetails: (tournament: Tournament) => void;
}> = ({ tournament, onViewDetails }) => {
  const statusInfo = getStatusLabel(tournament.status);

  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold truncate pr-2">
          {tournament.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(tournament)}
          className="w-full"
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  );
};

export const TournamentsList: React.FC = () => {
  const { tournaments, loading, error, refetch } = useTournaments();
  const navigate = useNavigate();
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTournament(null);
  };

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
        <div className="bg-muted/50 rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-2">
            No hay torneos registrados
          </h3>
          <p className="text-muted-foreground mb-4">
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Tournament Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        {selectedTournament && (
          <TournamentDetails tournament={selectedTournament} />
        )}
      </Drawer>
    </>
  );
};
