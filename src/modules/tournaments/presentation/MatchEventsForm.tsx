import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Select } from "@/ui-lib/atoms/Select";
import type { Player } from "@/modules/teams/domain/types";
import type { Match } from "../domain/types";

interface MatchEventsFormProps {
  match: Match;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  onAddEvent: (event: {
    player_id: string;
    type: "goal" | "yellow_card" | "red_card" | "blue_card";
    minute?: number;
    description?: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const MatchEventsForm: React.FC<MatchEventsFormProps> = ({
  match,
  homeTeamPlayers,
  awayTeamPlayers,
  onAddEvent,
  loading,
  error,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [eventType, setEventType] = useState<
    "goal" | "yellow_card" | "red_card" | "blue_card"
  >("goal");
  const [minute, setMinute] = useState("");
  const [description, setDescription] = useState("");

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽ Gol";
      case "yellow_card":
        return "🟨 Tarjeta Amarilla";
      case "red_card":
        return "🟥 Tarjeta Roja";
      case "blue_card":
        return "🟦 Tarjeta Azul";
      default:
        return type;
    }
  };

  const getPlayerTeam = (playerId: string) => {
    const isHomePlayer = homeTeamPlayers.some((p) => p.id === playerId);
    return isHomePlayer ? match.home_team.name : match.away_team.name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    await onAddEvent({
      player_id: selectedPlayer,
      type: eventType,
      minute: minute ? parseInt(minute) : undefined,
      description: description || undefined,
    });

    // Reset form
    setSelectedPlayer("");
    setMinute("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Registrar Eventos del Partido</h3>
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
          <Label htmlFor="player">Jugador</Label>
          <Select
            id="player"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            required
          >
            <option value="">Seleccionar jugador</option>
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
          {selectedPlayer && (
            <p className="text-sm text-gray-600 mt-1">
              Equipo: {getPlayerTeam(selectedPlayer)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="event-type">Tipo de Evento</Label>
          <Select
            id="event-type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as typeof eventType)}
            required
          >
            <option value="goal">⚽ Gol</option>
            <option value="yellow_card">🟨 Tarjeta Amarilla</option>
            <option value="red_card">🟥 Tarjeta Roja</option>
            <option value="blue_card">🟦 Tarjeta Azul</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="minute">Minuto (opcional)</Label>
          <Input
            id="minute"
            type="number"
            min="1"
            max="120"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="Ej: 45"
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Golazo desde fuera del área"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={loading || !selectedPlayer}>
            {loading
              ? "Registrando..."
              : `Registrar ${getEventTypeLabel(eventType)}`}
          </Button>
        </div>
      </form>
    </div>
  );
};
