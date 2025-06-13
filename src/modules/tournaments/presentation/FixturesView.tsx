import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/ui-lib/atoms/Dialog";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { useFixtures } from "../application/hooks/useFixtures";
import { useScheduleMatch } from "../application/hooks/useScheduleMatch";
import { useRegisterLineup } from "../application/hooks/useRegisterLineup";
import { useMatchEvents } from "../application/hooks/useMatchEvents";
import { useMatchLineups } from "../application/hooks/useMatchLineups";
import { useGetMatchEvents } from "../application/hooks/useGetMatchEvents";
import { useTeam } from "@/modules/teams/application/hooks/useTeam";
import { useMatchSubstitutions } from "../application/hooks/useMatchSubstitutions";
import type { Match } from "../domain/types";
import { LineupForm } from "./LineupForm";
import { MatchEventsForm } from "./MatchEventsForm";
import { MatchLineupsView } from "./MatchLineupsView";
import { MatchEventsView } from "./MatchEventsView";
import { SubstitutionForm } from "./SubstitutionForm";

interface FixturesViewProps {
  tournamentId: string;
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "scheduled":
      return "Programado";
    case "in_progress":
      return "En curso";
    case "finished":
      return "Finalizado";
    default:
      return status;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-green-100 text-green-800";
    case "finished":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface MatchCardProps {
  match: Match;
  onSchedule: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onSchedule }) => {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLineupDialogOpen, setIsLineupDialogOpen] = useState(false);
  const [isEventsDialogOpen, setIsEventsDialogOpen] = useState(false);
  const [isViewLineupsDialogOpen, setIsViewLineupsDialogOpen] = useState(false);
  const [isViewEventsDialogOpen, setIsViewEventsDialogOpen] = useState(false);
  const [isSubstitutionDialogOpen, setIsSubstitutionDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "away">("home");
  const [matchDate, setMatchDate] = useState("");
  const [venue, setVenue] = useState("");
  const {
    scheduleMatch,
    loading: scheduleLoading,
    error: scheduleError,
  } = useScheduleMatch(match.id);
  const {
    registerLineup,
    loading: lineupLoading,
    error: lineupError,
  } = useRegisterLineup(match.id);
  const {
    addEvent,
    loading: eventLoading,
    error: eventError,
  } = useMatchEvents(match.id);
  const {
    addSubstitution,
    loading: substitutionLoading,
    error: substitutionError,
  } = useMatchSubstitutions(match.id);
  const {
    lineups,
    loading: lineupsLoading,
    error: lineupsError,
    refetch: refetchLineups,
  } = useMatchLineups(match.id, isViewLineupsDialogOpen);
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useGetMatchEvents(match.id, isViewEventsDialogOpen);
  const {
    team: homeTeam,
    loading: homeTeamLoading,
    error: homeTeamError,
  } = useTeam(isLineupDialogOpen ? match.home_team.id : "");
  const {
    team: awayTeam,
    loading: awayTeamLoading,
    error: awayTeamError,
  } = useTeam(isLineupDialogOpen ? match.away_team.id : "");
  const {
    team: homeTeamForEvents,
    loading: homeTeamEventsLoading,
    error: homeTeamEventsError,
  } = useTeam(isEventsDialogOpen ? match.home_team.id : "");
  const {
    team: awayTeamForEvents,
    loading: awayTeamEventsLoading,
    error: awayTeamEventsError,
  } = useTeam(isEventsDialogOpen ? match.away_team.id : "");
  const {
    team: homeTeamForSubstitutions,
    loading: homeTeamSubstitutionsLoading,
    error: homeTeamSubstitutionsError,
  } = useTeam(isSubstitutionDialogOpen ? match.home_team.id : "");
  const {
    team: awayTeamForSubstitutions,
    loading: awayTeamSubstitutionsLoading,
    error: awayTeamSubstitutionsError,
  } = useTeam(isSubstitutionDialogOpen ? match.away_team.id : "");

  const handleSchedule = async () => {
    await scheduleMatch({
      match_date: matchDate,
      venue: venue || undefined,
    });
    setIsScheduleDialogOpen(false);
    onSchedule();
  };

  const handleRegisterLineup = async (data: {
    team_id: string;
    players: Array<{
      player_id: string;
      is_starter: boolean;
      shirt_number: number;
    }>;
  }) => {
    await registerLineup(data);
    onSchedule();
    refetchLineups();
    refetchEvents();
  };

  const handleAddEvent = async (event: {
    player_id: string;
    type: "goal" | "yellow_card" | "red_card" | "blue_card";
    minute?: number;
    description?: string;
  }) => {
    await addEvent(event);
    onSchedule();
    refetchEvents();
  };

  const handleAddSubstitution = async (substitution: {
    player_out_id: string;
    player_in_id: string;
    minute: number;
  }) => {
    await addSubstitution(substitution);
    onSchedule();
    refetchEvents();
  };

  const handleOpenLineupDialog = () => {
    setActiveTab("home");
    setIsLineupDialogOpen(true);
  };

  const handleOpenEventsDialog = () => {
    setIsEventsDialogOpen(true);
  };

  const handleOpenViewLineupsDialog = () => {
    setIsViewLineupsDialogOpen(true);
  };

  const handleOpenViewEventsDialog = () => {
    setIsViewEventsDialogOpen(true);
  };

  const handleOpenSubstitutionDialog = () => {
    setIsSubstitutionDialogOpen(true);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{match.home_team.name}</span>
            <span>vs</span>
            <span className="font-semibold">{match.away_team.name}</span>
          </div>
          {match.match_date && (
            <div className="text-sm text-gray-600">
              {new Date(match.match_date).toLocaleString()}
            </div>
          )}
          {match.venue && (
            <div className="text-sm text-gray-600">{match.venue}</div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded text-sm ${getStatusColor(
              match.status
            )}`}
          >
            {getStatusLabel(match.status)}
          </span>
          {match.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsScheduleDialogOpen(true)}
            >
              Programar
            </Button>
          )}
          {match.status === "scheduled" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsScheduleDialogOpen(true)}
              >
                Reprogramar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenLineupDialog}
              >
                Alineaciones
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenViewLineupsDialog}
              >
                Ver Alineaciones
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenEventsDialog}
              >
                Eventos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenViewEventsDialog}
              >
                Ver Eventos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenSubstitutionDialog}
              >
                Sustituciones
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent>
          <DialogTitle>
            {match.status === "scheduled"
              ? "Reprogramar Partido"
              : "Programar Partido"}
          </DialogTitle>
          <div className="space-y-4">
            <div>
              <Label htmlFor="match-date">Fecha y Hora</Label>
              <Input
                id="match-date"
                type="datetime-local"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="venue">Sede (opcional)</Label>
              <Input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Ingrese la sede del partido"
              />
            </div>
            {scheduleError && (
              <div className="text-red-600 text-sm">{scheduleError}</div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsScheduleDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={scheduleLoading || !matchDate}
            >
              {scheduleLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLineupDialogOpen} onOpenChange={setIsLineupDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>Gestionar Alineaciones</DialogTitle>

          <div className="space-y-4">
            {/* Team Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "home"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("home")}
              >
                {match.home_team.name} (Local)
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "away"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("away")}
              >
                {match.away_team.name} (Visitante)
              </button>
            </div>

            {/* Team Content */}
            <div className="min-h-[400px]">
              {activeTab === "home" && (
                <>
                  {homeTeamLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div>Cargando jugadores...</div>
                    </div>
                  ) : homeTeamError ? (
                    <div className="text-red-600 py-8 text-center">
                      Error al cargar los jugadores: {homeTeamError}
                    </div>
                  ) : homeTeam && homeTeam.players ? (
                    <LineupForm
                      team={homeTeam}
                      players={homeTeam.players}
                      onSubmit={handleRegisterLineup}
                      onCancel={() => setIsLineupDialogOpen(false)}
                      loading={lineupLoading}
                      error={lineupError}
                    />
                  ) : (
                    <div className="text-center py-8">
                      No se encontraron jugadores para este equipo
                    </div>
                  )}
                </>
              )}

              {activeTab === "away" && (
                <>
                  {awayTeamLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div>Cargando jugadores...</div>
                    </div>
                  ) : awayTeamError ? (
                    <div className="text-red-600 py-8 text-center">
                      Error al cargar los jugadores: {awayTeamError}
                    </div>
                  ) : awayTeam && awayTeam.players ? (
                    <LineupForm
                      team={awayTeam}
                      players={awayTeam.players}
                      onSubmit={handleRegisterLineup}
                      onCancel={() => setIsLineupDialogOpen(false)}
                      loading={lineupLoading}
                      error={lineupError}
                    />
                  ) : (
                    <div className="text-center py-8">
                      No se encontraron jugadores para este equipo
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEventsDialogOpen} onOpenChange={setIsEventsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {homeTeamEventsLoading || awayTeamEventsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div>Cargando jugadores...</div>
            </div>
          ) : homeTeamEventsError || awayTeamEventsError ? (
            <div className="text-red-600 py-8 text-center">
              Error al cargar los jugadores:{" "}
              {homeTeamEventsError || awayTeamEventsError}
            </div>
          ) : homeTeamForEvents &&
            awayTeamForEvents &&
            homeTeamForEvents.players &&
            awayTeamForEvents.players ? (
            <MatchEventsForm
              match={match}
              homeTeamPlayers={homeTeamForEvents.players}
              awayTeamPlayers={awayTeamForEvents.players}
              onAddEvent={handleAddEvent}
              loading={eventLoading}
              error={eventError}
            />
          ) : (
            <div className="text-center py-8">
              No se encontraron jugadores para los equipos
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewLineupsDialogOpen}
        onOpenChange={setIsViewLineupsDialogOpen}
      >
        <DialogContent className="max-w-6xl">
          <MatchLineupsView
            match={match}
            lineups={lineups}
            loading={lineupsLoading}
            error={lineupsError}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewEventsDialogOpen}
        onOpenChange={setIsViewEventsDialogOpen}
      >
        <DialogContent className="max-w-6xl">
          <MatchEventsView
            match={match}
            events={events}
            loading={eventsLoading}
            error={eventsError}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSubstitutionDialogOpen}
        onOpenChange={setIsSubstitutionDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          {homeTeamSubstitutionsLoading || awayTeamSubstitutionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div>Cargando jugadores...</div>
            </div>
          ) : homeTeamSubstitutionsError || awayTeamSubstitutionsError ? (
            <div className="text-red-600 py-8 text-center">
              Error al cargar los jugadores:{" "}
              {homeTeamSubstitutionsError || awayTeamSubstitutionsError}
            </div>
          ) : homeTeamForSubstitutions &&
            awayTeamForSubstitutions &&
            homeTeamForSubstitutions.players &&
            awayTeamForSubstitutions.players ? (
            <SubstitutionForm
              match={match}
              homeTeamPlayers={homeTeamForSubstitutions.players}
              awayTeamPlayers={awayTeamForSubstitutions.players}
              onAddSubstitution={handleAddSubstitution}
              loading={substitutionLoading}
              error={substitutionError}
            />
          ) : (
            <div className="text-center py-8">
              No se encontraron jugadores para los equipos
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const FixturesView: React.FC<FixturesViewProps> = ({ tournamentId }) => {
  const { fixtures, loading, error, refetch } = useFixtures(tournamentId);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!fixtures) {
    return <div>No hay fixtures disponibles</div>;
  }

  return (
    <div className="space-y-8">
      {fixtures.phases.map((phase) => (
        <div key={phase.phase_id} className="space-y-4">
          <h2 className="text-xl font-semibold">{phase.phase_name}</h2>
          {phase.rounds.map((round) => (
            <div key={`${phase.phase_id}-${round.round}`} className="space-y-4">
              <h3 className="text-lg font-medium">Ronda {round.round}</h3>
              <div className="grid gap-4">
                {round.matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onSchedule={refetch}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
