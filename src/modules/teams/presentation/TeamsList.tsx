import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { useTeams } from "../application/hooks/useTeams";

interface TeamsListProps {
  onRefetchReady?: (refetch: () => void) => void;
}

export const TeamsList: React.FC<TeamsListProps> = ({ onRefetchReady }) => {
  const { teams, loading, error, refetch } = useTeams();
  const navigate = useNavigate();

  // Expose refetch function to parent
  React.useEffect(() => {
    if (onRefetchReady) {
      onRefetchReady(refetch);
    }
  }, [refetch, onRefetchReady]);

  const handleViewTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

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
        <div className="bg-muted/50 rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-2">
            No hay equipos registrados
          </h3>
          <p className="text-muted-foreground mb-4">
            Aún no has creado ningún equipo. ¡Crea tu primer equipo para
            comenzar!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {teams.map((team, index) => (
            <tr
              key={team.id}
              className={`hover:bg-muted/30 transition-colors ${
                index % 2 === 0 ? "bg-background" : "bg-muted/10"
              }`}
            >
              <td className="p-4">
                <div className="flex items-center">
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
                </div>
              </td>
              <td className="p-4">
                <div>
                  <span className="font-medium">{team.name}</span>
                  <p className="text-sm text-muted-foreground">
                    {team.players?.length || 0} jugador
                    {team.players?.length !== 1 ? "es" : ""} registrado
                    {team.players?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </td>
              <td className="p-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewTeam(team.id)}
                  className="h-8 w-8 p-0"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="sr-only">Ver equipo</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
