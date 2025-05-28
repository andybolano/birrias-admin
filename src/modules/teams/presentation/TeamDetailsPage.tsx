import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { DrawerWrapper as Drawer } from "@/ui-lib/atoms/DrawerWrapper";
import { useTeam } from "../application/hooks/useTeam";
import { CreatePlayerDrawer } from "./CreatePlayerDrawer";
import { PlayersList } from "./PlayersList";

export const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { team, loading, error, refetch } = useTeam(teamId!);
  const [isCreatePlayerDrawerOpen, setIsCreatePlayerDrawerOpen] =
    useState(false);

  const handleCreatePlayerSuccess = () => {
    setIsCreatePlayerDrawerOpen(false);
    // Refresh team data to get updated players list
    refetch();
  };

  const handleCreatePlayerCancel = () => {
    setIsCreatePlayerDrawerOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando equipo...
          </p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            {error || "No se pudo cargar la información del equipo"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/teams")}
            className="mt-2"
          >
            Volver a Equipos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 pb-20">
        {/* Header with breadcrumbs */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/teams")}
            className="h-8 w-8 p-0 mr-3"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="sr-only">Volver</span>
          </Button>

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <button
              onClick={() => navigate("/teams")}
              className="hover:text-foreground transition-colors"
            >
              Equipos
            </button>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-foreground font-medium">Jugadores</span>
          </nav>
        </div>

        {/* Team Information - Compact */}
        <div className="flex items-center justify-between mb-6  bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {team.shield ? (
                <img
                  src={team.shield}
                  alt={`Escudo de ${team.name}`}
                  className="h-12 w-12 object-cover rounded-md border-2 border-gray-200"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center border-2 border-gray-300">
                  <svg
                    className="h-6 w-6 text-gray-400"
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
              <h2 className="text-xl font-semibold">{team.name}</h2>
              <p className="text-sm text-muted-foreground">
                {team.players?.length || 0} jugador
                {team.players?.length !== 1 ? "es" : ""} registrado
                {team.players?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            variant="default"
            onClick={() => setIsCreatePlayerDrawerOpen(true)}
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Agregar Jugador
          </Button>
        </div>

        {/* Players Section */}
        <div className="bg-card rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Jugadores del Equipo</h3>
          </div>

          <PlayersList players={team.players || []} />
        </div>
      </div>

      {/* Create Player Drawer */}
      <Drawer
        isOpen={isCreatePlayerDrawerOpen}
        onClose={handleCreatePlayerCancel}
        title="Agregar Jugador"
      >
        <CreatePlayerDrawer
          teamId={teamId!}
          onSuccess={handleCreatePlayerSuccess}
          onCancel={handleCreatePlayerCancel}
        />
      </Drawer>
    </>
  );
};
