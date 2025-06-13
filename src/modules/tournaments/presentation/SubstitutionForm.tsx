import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Select } from "@/ui-lib/atoms/Select";
import type { Player } from "@/modules/teams/domain/types";
import type { Match } from "../domain/types";

interface SubstitutionFormProps {
  match: Match;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  onAddSubstitution: (substitution: {
    player_out_id: string;
    player_in_id: string;
    minute: number;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const SubstitutionForm: React.FC<SubstitutionFormProps> = ({
  match,
  homeTeamPlayers,
  awayTeamPlayers,
  onAddSubstitution,
  loading,
  error,
}) => {
  const [playerOutId, setPlayerOutId] = useState("");
  const [playerInId, setPlayerInId] = useState("");
  const [minute, setMinute] = useState("");

  const getPlayerTeam = (playerId: string) => {
    const isHomePlayer = homeTeamPlayers.some((p) => p.id === playerId);
    return isHomePlayer ? match.home_team.name : match.away_team.name;
  };

  const getTeamPlayers = (playerId: string) => {
    const isHomePlayer = homeTeamPlayers.some((p) => p.id === playerId);
    return isHomePlayer ? homeTeamPlayers : awayTeamPlayers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerOutId || !playerInId || !minute) return;

    // Validate that players are from the same team
    const playerOutTeam = getPlayerTeam(playerOutId);
    const playerInTeam = getPlayerTeam(playerInId);

    if (playerOutTeam !== playerInTeam) {
      alert("Los jugadores deben ser del mismo equipo");
      return;
    }

    await onAddSubstitution({
      player_out_id: playerOutId,
      player_in_id: playerInId,
      minute: parseInt(minute),
    });

    // Reset form
    setPlayerOutId("");
    setPlayerInId("");
    setMinute("");
  };

  const isInvalidTeamSelection = Boolean(
    playerOutId &&
      playerInId &&
      getPlayerTeam(playerOutId) !== getPlayerTeam(playerInId)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Registrar Sustitución</h3>
        <p className="text-sm text-gray-600">
          {match.home_team.name} vs {match.away_team.name}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="player-out">Jugador que sale</Label>
          <Select
            id="player-out"
            value={playerOutId}
            onChange={(e) => setPlayerOutId(e.target.value)}
            required
          >
            <option value="">Seleccionar jugador que sale</option>
            <optgroup label={match.home_team.name}>
              {homeTeamPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.jersey} - {player.first_name} {player.last_name}
                </option>
              ))}
            </optgroup>
            <optgroup label={match.away_team.name}>
              {awayTeamPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.jersey} - {player.first_name} {player.last_name}
                </option>
              ))}
            </optgroup>
          </Select>
          {playerOutId && (
            <p className="text-sm text-gray-600 mt-1">
              Equipo: {getPlayerTeam(playerOutId)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="player-in">Jugador que entra</Label>
          <Select
            id="player-in"
            value={playerInId}
            onChange={(e) => setPlayerInId(e.target.value)}
            required
          >
            <option value="">Seleccionar jugador que entra</option>
            {playerOutId && (
              <optgroup label={getPlayerTeam(playerOutId)}>
                {getTeamPlayers(playerOutId)
                  .filter((player) => player.id !== playerOutId)
                  .map((player) => (
                    <option key={player.id} value={player.id}>
                      #{player.jersey} - {player.first_name} {player.last_name}
                    </option>
                  ))}
              </optgroup>
            )}
            {!playerOutId && (
              <>
                <optgroup label={match.home_team.name}>
                  {homeTeamPlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      #{player.jersey} - {player.first_name} {player.last_name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={match.away_team.name}>
                  {awayTeamPlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      #{player.jersey} - {player.first_name} {player.last_name}
                    </option>
                  ))}
                </optgroup>
              </>
            )}
          </Select>
          {playerInId && (
            <p className="text-sm text-gray-600 mt-1">
              Equipo: {getPlayerTeam(playerInId)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="minute">Minuto</Label>
          <Input
            id="minute"
            type="number"
            min="1"
            max="120"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="Ej: 67"
            required
          />
        </div>

        {isInvalidTeamSelection && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ Los jugadores deben ser del mismo equipo
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={
              loading ||
              !playerOutId ||
              !playerInId ||
              !minute ||
              isInvalidTeamSelection
            }
          >
            {loading ? "Registrando..." : "🔄 Registrar Sustitución"}
          </Button>
        </div>
      </form>
    </div>
  );
};
