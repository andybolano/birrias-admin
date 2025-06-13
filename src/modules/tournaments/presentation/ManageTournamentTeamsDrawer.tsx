import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRemoveTeamFromTournament } from "../application/hooks/useRemoveTeamFromTournament";
import type { Tournament, TournamentTeam } from "../domain/types";

interface ManageTournamentTeamsDrawerProps {
  tournament: Tournament;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ManageTournamentTeamsDrawer: React.FC<
  ManageTournamentTeamsDrawerProps
> = ({ tournament, onSuccess, onCancel }) => {
  const { removeTeamFromTournament, loading, error } =
    useRemoveTeamFromTournament();
  const [removingTeamId, setRemovingTeamId] = useState<string | null>(null);

  const handleRemoveTeam = async (team: TournamentTeam) => {
    try {
      setRemovingTeamId(team.id);
      await removeTeamFromTournament(tournament.id, team.id);
      onSuccess?.();
    } catch (error) {
      console.error("Error removing team from tournament:", error);
    } finally {
      setRemovingTeamId(null);
    }
  };

  if (tournament.teams.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-muted/50 rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-2">
            No hay equipos inscritos
          </h3>
          <p className="text-muted-foreground mb-4">
            Este torneo aún no tiene equipos inscritos.
          </p>
          <Button variant="outline" onClick={onCancel}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Gestionar Equipos</h2>
        <p className="text-muted-foreground">{tournament.name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {tournament.teams.length} equipo
          {tournament.teams.length !== 1 ? "s" : ""} inscrito
          {tournament.teams.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Teams List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tournament.teams.map((team) => (
          <div key={team.id} className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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
                <div className="flex-1">
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Inscrito en el torneo
                  </p>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={loading || removingTeamId === team.id}
                  >
                    {removingTeamId === team.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Eliminando...
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Eliminar
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Estás absolutamente seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará a "{team.name}" del torneo "
                      {tournament.name}". Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRemoveTeam(team)}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                      Eliminar Equipo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-4 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full"
          disabled={loading}
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};
