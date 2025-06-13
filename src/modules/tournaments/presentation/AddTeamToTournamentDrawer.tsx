import React, { useState, useMemo } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { useTeams } from "@/modules/teams/application/hooks/useTeams";
import { useAddTeamsToTournamentBulk } from "../application/hooks/useAddTeamsToTournamentBulk";
import type { Team } from "@/modules/teams/domain/types";
import type { Tournament } from "../domain/types";

interface AddTeamToTournamentDrawerProps {
  tournament: Tournament;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddTeamToTournamentDrawer: React.FC<
  AddTeamToTournamentDrawerProps
> = ({ tournament, onSuccess, onCancel }) => {
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();
  const {
    addTeamsToTournament,
    loading: addLoading,
    error: addError,
  } = useAddTeamsToTournamentBulk();
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar equipos que ya están inscritos en el torneo
  const availableTeams = useMemo(() => {
    if (!teams || !tournament.teams) return teams;

    const enrolledTeamIds = new Set(tournament.teams.map((team) => team.id));
    return teams.filter((team) => !enrolledTeamIds.has(team.id));
  }, [teams, tournament.teams]);

  // Filter available teams based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableTeams;
    }
    return availableTeams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableTeams, searchTerm]);

  const handleTeamToggle = (team: Team) => {
    const newSelectedTeams = new Set(selectedTeams);
    if (newSelectedTeams.has(team.id)) {
      newSelectedTeams.delete(team.id);
    } else {
      newSelectedTeams.add(team.id);
    }
    setSelectedTeams(newSelectedTeams);
  };

  const handleSelectAll = () => {
    if (selectedTeams.size === filteredTeams.length) {
      // Deselect all
      setSelectedTeams(new Set());
    } else {
      // Select all filtered teams
      const allFilteredIds = new Set(filteredTeams.map((team) => team.id));
      setSelectedTeams(allFilteredIds);
    }
  };

  const handleAddTeams = async () => {
    if (selectedTeams.size === 0) return;

    try {
      await addTeamsToTournament(tournament.id, Array.from(selectedTeams));
      onSuccess?.();
    } catch (error) {
      console.error("Error adding teams to tournament:", error);
    }
  };

  const handleCancel = () => {
    setSelectedTeams(new Set());
    onCancel?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Clear selections that are not in filtered results
    const filteredTeamIds = new Set(filteredTeams.map((team) => team.id));
    const newSelectedTeams = new Set(
      Array.from(selectedTeams).filter((teamId) => filteredTeamIds.has(teamId))
    );
    setSelectedTeams(newSelectedTeams);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (teamsLoading) {
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

  if (teamsError) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{teamsError}</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-muted/50 rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-2">
            No hay equipos disponibles
          </h3>
          <p className="text-muted-foreground mb-4">
            Necesitas crear equipos antes de poder agregarlos a un torneo.
          </p>
          <Button variant="outline" onClick={handleCancel}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  if (availableTeams.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-muted/50 rounded-lg p-8">
          <h3 className="text-lg font-semibold mb-2">
            Todos los equipos ya están inscritos
          </h3>
          <p className="text-muted-foreground mb-4">
            Todos los equipos disponibles ya están inscritos en este torneo.
          </p>
          <Button variant="outline" onClick={handleCancel}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  const selectedCount = selectedTeams.size;
  const allFilteredSelected =
    filteredTeams.length > 0 && selectedTeams.size === filteredTeams.length;

  return (
    <div className="flex flex-col h-full">
      {/* Error Message */}
      {addError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800">{addError}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4">
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
          placeholder="Buscar equipos disponibles..."
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

      {/* Selection Controls */}
      {filteredTeams.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {allFilteredSelected ? "Deseleccionar todo" : "Seleccionar todo"}
            </Button>
            {selectedCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedCount} equipo{selectedCount !== 1 ? "s" : ""}{" "}
                seleccionado{selectedCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground mb-4">
          {filteredTeams.length === 0 ? (
            <p>No se encontraron equipos que coincidan con "{searchTerm}"</p>
          ) : (
            <p>
              Mostrando {filteredTeams.length} de {availableTeams.length}{" "}
              equipos disponibles
              {filteredTeams.length !== availableTeams.length &&
                ` para "${searchTerm}"`}
            </p>
          )}
        </div>
      )}

      {/* Teams List - Scrollable Area */}
      <div className="flex-1 overflow-y-auto mb-4">
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
                No hay equipos disponibles que coincidan con tu búsqueda "
                {searchTerm}".
              </p>
              <Button variant="outline" onClick={clearSearch}>
                Limpiar búsqueda
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeams.map((team) => {
              const isSelected = selectedTeams.has(team.id);
              return (
                <div
                  key={team.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleTeamToggle(team)}
                >
                  <div className="flex items-center space-x-3">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Team Shield */}
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

                    {/* Team Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {team.players?.length || 0} jugador
                        {team.players?.length !== 1 ? "es" : ""} registrado
                        {team.players?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="flex space-x-3 pt-4 border-t bg-background">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
          disabled={addLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddTeams}
          className="flex-1"
          disabled={selectedCount === 0 || addLoading}
        >
          {addLoading
            ? "Agregando..."
            : `Agregar ${selectedCount} equipo${
                selectedCount !== 1 ? "s" : ""
              }`}
        </Button>
      </div>
    </div>
  );
};
