import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Checkbox } from "@/ui-lib/atoms/Checkbox";
import type { Team, Player } from "@/modules/teams/domain/types";

interface LineupFormProps {
  team: Team;
  players: Player[];
  onSubmit: (data: {
    team_id: string;
    players: Array<{
      player_id: string;
      is_starter: boolean;
      shirt_number: number;
    }>;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

export const LineupForm: React.FC<LineupFormProps> = ({
  team,
  players,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<
    Array<{
      player_id: string;
      is_starter: boolean;
      shirt_number: number;
    }>
  >([]);

  const handlePlayerToggle = (playerId: string, isStarter: boolean) => {
    setSelectedPlayers((prev) => {
      const existing = prev.find((p) => p.player_id === playerId);
      if (existing) {
        return prev.map((p) =>
          p.player_id === playerId ? { ...p, is_starter: isStarter } : p
        );
      }

      // Find the player to get their registered jersey number
      const player = players.find((p) => p.id === playerId);
      const defaultShirtNumber = player?.jersey || 0;

      return [
        ...prev,
        {
          player_id: playerId,
          is_starter: isStarter,
          shirt_number: defaultShirtNumber,
        },
      ];
    });
  };

  const handleShirtNumberChange = (playerId: string, number: number) => {
    setSelectedPlayers((prev) =>
      prev.map((p) =>
        p.player_id === playerId ? { ...p, shirt_number: number } : p
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      team_id: team.id,
      players: selectedPlayers,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Alineación de {team.name}</h3>
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center space-x-4">
              <Checkbox
                id={`player-${player.id}`}
                checked={selectedPlayers.some((p) => p.player_id === player.id)}
                onChange={(e) =>
                  handlePlayerToggle(player.id, e.target.checked)
                }
              />
              <Label htmlFor={`player-${player.id}`} className="flex-1">
                {player.first_name} {player.last_name}
                <span className="text-sm text-gray-500 ml-2">
                  (#{player.jersey})
                </span>
              </Label>
              {selectedPlayers.some((p) => p.player_id === player.id) && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`number-${player.id}`}>Número:</Label>
                  <Input
                    id={`number-${player.id}`}
                    type="number"
                    min="1"
                    max="99"
                    value={
                      selectedPlayers.find((p) => p.player_id === player.id)
                        ?.shirt_number || ""
                    }
                    onChange={(e) =>
                      handleShirtNumberChange(
                        player.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-20"
                    placeholder={player.jersey.toString()}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || selectedPlayers.length === 0}
        >
          {loading ? "Registrando..." : "Registrar Alineación"}
        </Button>
      </div>
    </form>
  );
};
