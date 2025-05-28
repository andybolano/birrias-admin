import React from "react";
import type { Player } from "../domain/types";

const getPositionLabel = (position: string) => {
  const positions: Record<string, string> = {
    goalkeeper: "Portero",
    defender: "Defensor",
    midfielder: "Mediocampista",
    forward: "Delantero",
  };
  return positions[position] || position;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

interface PlayersListProps {
  players: Player[];
}

export const PlayersList: React.FC<PlayersListProps> = ({ players }) => {
  if (players.length === 0) {
    return (
      <div className="text-center py-12">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h4 className="text-lg font-semibold mb-2">
            No hay jugadores registrados
          </h4>
          <p className="text-muted-foreground mb-4">
            Aún no has agregado jugadores a este equipo. ¡Agrega tu primer
            jugador para comenzar!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {players.map((player, index) => (
            <tr
              key={player.id}
              className={`hover:bg-muted/30 transition-colors ${
                index % 2 === 0 ? "bg-background" : "bg-muted/10"
              }`}
            >
              <td className="p-3 w-12">
                <div className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground rounded text-sm font-bold">
                  {player.jersey}
                </div>
              </td>
              <td className="p-3 flex-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">
                      {player.first_name} {player.last_name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(player.birthDay)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {getPositionLabel(player.position)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ID: {player.identification_number}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    EPS: {player.eps}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
