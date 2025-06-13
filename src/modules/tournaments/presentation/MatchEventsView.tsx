import React from "react";
import type { Match } from "../domain/types";

interface MatchEventPlayer {
  id: string;
  name: string;
}

interface MatchEvent {
  id: string;
  type: "goal" | "yellow_card" | "red_card" | "blue_card" | "substitution";
  minute: number;
  description: string;
  player: MatchEventPlayer;
  substitute_player?: MatchEventPlayer;
  created_at: string;
}

interface MatchEventsViewProps {
  match: Match;
  events: MatchEvent[];
  loading: boolean;
  error: string | null;
}

export const MatchEventsView: React.FC<MatchEventsViewProps> = ({
  match,
  events,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div>Cargando eventos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 py-8 text-center">
        Error al cargar los eventos: {error}
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow_card":
        return "🟨";
      case "red_card":
        return "🟥";
      case "blue_card":
        return "🟦";
      case "substitution":
        return "🔄";
      default:
        return "📝";
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case "goal":
        return "Gol";
      case "yellow_card":
        return "Tarjeta Amarilla";
      case "red_card":
        return "Tarjeta Roja";
      case "blue_card":
        return "Tarjeta Azul";
      case "substitution":
        return "Sustitución";
      default:
        return type;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "goal":
        return "bg-green-50 border-green-200 text-green-800";
      case "yellow_card":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "red_card":
        return "bg-red-50 border-red-200 text-red-800";
      case "blue_card":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "substitution":
        return "bg-purple-50 border-purple-200 text-purple-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  // Sort events by minute
  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  // Group events by type for summary
  const eventsSummary = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Eventos del Partido</h2>
        <p className="text-gray-600">
          {match.home_team.name} vs {match.away_team.name}
        </p>
        {match.match_date && (
          <p className="text-sm text-gray-500">
            {new Date(match.match_date).toLocaleString()}
          </p>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">
            No hay eventos registrados para este partido
          </div>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Resumen de Eventos</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(eventsSummary).map(([type, count]) => (
                <div key={type} className="flex items-center space-x-2">
                  <span className="text-lg">{getEventIcon(type)}</span>
                  <span className="text-sm">
                    {getEventLabel(type)}: <strong>{count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Events Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cronología de Eventos</h3>
            <div className="space-y-3">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 ${getEventColor(
                    event.type
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getEventIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-lg">
                            {event.minute}'
                          </span>
                          <span className="font-medium">
                            {getEventLabel(event.type)}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 mb-1">
                          {event.type === "substitution" ? (
                            <div>
                              <span className="text-red-600">
                                Sale: {event.player.name}
                              </span>
                              <br />
                              <span className="text-green-600">
                                Entra: {event.substitute_player?.name}
                              </span>
                            </div>
                          ) : (
                            event.player.name
                          )}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-700">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
