import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { useTeams } from "../application/hooks/useTeams";

interface TeamsListProps {
  onRefetchReady?: (refetch: () => void) => void;
  onTeamsCountUpdate?: (count: number) => void;
}

export const TeamsList: React.FC<TeamsListProps> = ({
  onRefetchReady,
  onTeamsCountUpdate,
}) => {
  const { teams, loading, error, refetch } = useTeams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm.trim()) {
      return teams;
    }
    return teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teams, searchTerm]);

  // Expose refetch function to parent
  React.useEffect(() => {
    if (onRefetchReady) {
      onRefetchReady(refetch);
    }
  }, [refetch, onRefetchReady]);

  // Update teams count when teams change (use filtered count)
  React.useEffect(() => {
    if (onTeamsCountUpdate && !loading) {
      onTeamsCountUpdate(filteredTeams.length);
    }
  }, [filteredTeams.length, loading, onTeamsCountUpdate]);

  const handleViewTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Input
          type="text"
          placeholder="Buscar equipos por nombre..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          {filteredTeams.length === 0 ? (
            <p>No se encontraron equipos que coincidan con "{searchTerm}"</p>
          ) : (
            <p>
              Mostrando {filteredTeams.length} de {teams.length} equipos
              {filteredTeams.length !== teams.length && ` para "${searchTerm}"`}
            </p>
          )}
        </div>
      )}

      {/* Teams List */}
      {filteredTeams.length === 0 && searchTerm ? (
        <div className="text-center p-8">
          <div className="bg-muted/50 rounded-lg p-8">
            <svg
              className="h-12 w-12 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron equipos
            </h3>
            <p className="text-muted-foreground mb-4">
              No hay equipos que coincidan con tu búsqueda "{searchTerm}".
            </p>
            <Button variant="outline" onClick={clearSearch}>
              Limpiar búsqueda
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {filteredTeams.map((team, index) => (
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
      )}
    </div>
  );
};
