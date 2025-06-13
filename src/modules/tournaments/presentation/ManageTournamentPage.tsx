import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { DrawerWrapper as Drawer } from "@/ui-lib/atoms/DrawerWrapper";
import { useTournament } from "@/modules/tournaments/application/hooks/useTournament";
import { AddTeamToTournamentDrawer } from "./AddTeamToTournamentDrawer";
import { TournamentPhasesManager } from "./TournamentPhasesManager";
import { FixturesView } from "./FixturesView";
import { useRemoveTeamFromTournament } from "../application/hooks/useRemoveTeamFromTournament";
import { useGenerateFixtures } from "../application/hooks/useGenerateFixtures";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Team } from "@/modules/teams/domain/types";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

export const ManageTournamentPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { tournament, loading, error, refetch } = useTournament(tournamentId!);
  const { removeTeamFromTournament, loading: removeLoading } =
    useRemoveTeamFromTournament();
  const {
    generateFixtures,
    loading: generateLoading,
    error: generateError,
  } = useGenerateFixtures();

  const [activeTab, setActiveTab] = useState<"teams" | "fixtures" | "phases">(
    "teams"
  );
  const [isAddTeamDrawerOpen, setIsAddTeamDrawerOpen] = useState(false);
  const [teamToRemove, setTeamToRemove] = useState<Team | null>(null);
  const [removingTeamId, setRemovingTeamId] = useState<string | null>(null);
  const [showGenerateFixturesDialog, setShowGenerateFixturesDialog] =
    useState(false);

  const handleAddTeamSuccess = () => {
    setIsAddTeamDrawerOpen(false);
    refetch();
  };

  const handleAddTeamCancel = () => {
    setIsAddTeamDrawerOpen(false);
  };

  const handleRemoveTeam = async (team: Team) => {
    if (!tournament) return;

    setRemovingTeamId(team.id);
    try {
      await removeTeamFromTournament(tournament.id, team.id);
      refetch();
    } catch (error) {
      console.error("Error removing team:", error);
    } finally {
      setRemovingTeamId(null);
      setTeamToRemove(null);
    }
  };

  const handleGenerateFixtures = async () => {
    if (!tournament) return;

    try {
      await generateFixtures(tournament.id);
      setShowGenerateFixturesDialog(false);
      refetch();
    } catch (error) {
      console.error("Error generating fixtures:", error);
    }
  };

  const confirmRemoveTeam = (team: Team) => {
    setTeamToRemove(team);
  };

  const cancelRemoveTeam = () => {
    setTeamToRemove(null);
  };

  const confirmGenerateFixtures = () => {
    setShowGenerateFixturesDialog(true);
  };

  const cancelGenerateFixtures = () => {
    setShowGenerateFixturesDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando torneo...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error || "Torneo no encontrado"}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/tournaments")}
            >
              Volver a Torneos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusLabel(tournament.status);
  const hasTeams = tournament.teams && tournament.teams.length > 0;
  const hasMatches = tournament.matches && tournament.matches.length > 0;

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate("/tournaments")}
            className="hover:text-foreground transition-colors flex items-center"
          >
            <svg
              className="h-4 w-4 mr-1"
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
            Torneos
          </button>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">
            Gestión : {tournament.name}
          </span>
        </nav>

        {/* Tournament Header */}
        <div className="text-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
          <p className="text-muted-foreground mt-2">
            Fecha de inicio: {formatDate(tournament.start_date)}
          </p>
        </div>

        {/* Generate Fixtures Error */}
        {generateError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{generateError}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("teams")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "teams"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              Equipos
            </button>
            <button
              onClick={() => setActiveTab("fixtures")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "fixtures"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              Fixtures
            </button>
            <button
              onClick={() => setActiveTab("phases")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "phases"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              Fases
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "teams" && (
          <>
            {/* Teams Management Section */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Equipos del Torneo</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddTeamDrawerOpen(true)}
                  >
                    Agregar Equipo
                  </Button>
                  {hasTeams && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={confirmGenerateFixtures}
                      disabled={generateLoading}
                    >
                      {generateLoading ? "Generando..." : "Generar Fixtures"}
                    </Button>
                  )}
                </div>
              </div>

              {hasTeams ? (
                <div className="space-y-3">
                  {tournament.teams.map((team: Team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {team.shield ? (
                          <img
                            src={team.shield}
                            alt={`Escudo de ${team.name}`}
                            className="h-10 w-10 object-cover rounded-md border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center border-2 border-gray-300">
                            <svg
                              className="h-5 w-5 text-gray-400"
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
                        <div>
                          <h4 className="font-medium">{team.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {team.players?.length || 0} jugador
                            {team.players?.length !== 1 ? "es" : ""} registrado
                            {team.players?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmRemoveTeam(team)}
                        disabled={removingTeamId === team.id || removeLoading}
                      >
                        {removingTeamId === team.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="bg-muted/50 rounded-lg p-8">
                    <h4 className="text-lg font-semibold mb-2">
                      No hay equipos inscritos
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Este torneo aún no tiene equipos inscritos. Agrega el
                      primer equipo para comenzar.
                    </p>
                    <Button
                      variant="default"
                      onClick={() => setIsAddTeamDrawerOpen(true)}
                    >
                      Agregar Primer Equipo
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Tournament Stats */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Estadísticas</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">
                    Equipos inscritos
                  </span>
                  <span className="font-medium text-lg">
                    {tournament.teams?.length || 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">
                    Partidos generados
                  </span>
                  <span className="font-medium text-lg">
                    {tournament.matches?.length || 0}
                  </span>
                </div>
              </div>

              {hasMatches && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
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
                      Fixtures generados correctamente
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "fixtures" && (
          <FixturesView tournamentId={tournament.id} />
        )}

        {activeTab === "phases" && (
          <TournamentPhasesManager tournamentId={tournament.id} />
        )}
      </div>

      {/* Add Team Drawer */}
      <Drawer
        isOpen={isAddTeamDrawerOpen}
        onClose={handleAddTeamCancel}
        title="Agregar Equipo al Torneo"
      >
        <AddTeamToTournamentDrawer
          tournament={tournament}
          onSuccess={handleAddTeamSuccess}
          onCancel={handleAddTeamCancel}
        />
      </Drawer>

      {/* Remove Team Confirmation Dialog */}
      <AlertDialog open={!!teamToRemove} onOpenChange={cancelRemoveTeam}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al equipo "{teamToRemove?.name}" del torneo.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveTeam}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => teamToRemove && handleRemoveTeam(teamToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Equipo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Generate Fixtures Confirmation Dialog */}
      <AlertDialog
        open={showGenerateFixturesDialog}
        onOpenChange={cancelGenerateFixtures}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generar Fixtures del Torneo</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción generará todos los partidos del torneo basándose en
              los equipos inscritos y el formato seleccionado.
              {hasMatches && " Los fixtures existentes serán reemplazados."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelGenerateFixtures}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleGenerateFixtures}
              disabled={generateLoading}
            >
              {generateLoading ? "Generando..." : "Generar Fixtures"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
