import React from "react";
import type { Match } from "../domain/types";

interface LineupPlayer {
  player_id: string;
  player_name: string;
  shirt_number: number;
}

interface TeamLineup {
  team_id: string;
  team_name: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

interface MatchLineups {
  home_team: TeamLineup;
  away_team: TeamLineup;
}

interface MatchLineupsViewProps {
  match: Match;
  lineups: MatchLineups | null;
  loading: boolean;
  error: string | null;
}

export const MatchLineupsView: React.FC<MatchLineupsViewProps> = ({
  match,
  lineups,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div>Cargando alineaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 py-8 text-center">
        Error al cargar las alineaciones: {error}
      </div>
    );
  }

  if (!lineups) {
    return (
      <div className="text-center py-8">
        No hay alineaciones registradas para este partido
      </div>
    );
  }

  const TeamLineupCard: React.FC<{ team: TeamLineup; isHome: boolean }> = ({
    team,
    isHome,
  }) => (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {team.team_name} {isHome ? "(Local)" : "(Visitante)"}
      </h3>

      {/* Titulares */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-green-700">
          ⚽ Titulares ({team.starters.length})
        </h4>
        <div className="space-y-2">
          {team.starters.map((player) => (
            <div
              key={player.player_id}
              className="flex items-center justify-between p-2 bg-green-50 rounded border-l-4 border-green-500"
            >
              <span className="font-medium">{player.player_name}</span>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                #{player.shirt_number}
              </span>
            </div>
          ))}
        </div>
        {team.starters.length === 0 && (
          <p className="text-gray-500 text-sm italic">
            No hay titulares registrados
          </p>
        )}
      </div>

      {/* Suplentes */}
      <div>
        <h4 className="text-md font-medium mb-3 text-blue-700">
          🔄 Suplentes ({team.substitutes.length})
        </h4>
        <div className="space-y-2">
          {team.substitutes.map((player) => (
            <div
              key={player.player_id}
              className="flex items-center justify-between p-2 bg-blue-50 rounded border-l-4 border-blue-500"
            >
              <span className="font-medium">{player.player_name}</span>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                #{player.shirt_number}
              </span>
            </div>
          ))}
        </div>
        {team.substitutes.length === 0 && (
          <p className="text-gray-500 text-sm italic">
            No hay suplentes registrados
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Alineaciones del Partido</h2>
        <p className="text-gray-600">
          {match.home_team.name} vs {match.away_team.name}
        </p>
        {match.match_date && (
          <p className="text-sm text-gray-500">
            {new Date(match.match_date).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamLineupCard team={lineups.home_team} isHome={true} />
        <TeamLineupCard team={lineups.away_team} isHome={false} />
      </div>

      {/* Resumen */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Resumen</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">{lineups.home_team.team_name}:</span>
            <span className="ml-2">
              {lineups.home_team.starters.length} titulares,{" "}
              {lineups.home_team.substitutes.length} suplentes
            </span>
          </div>
          <div>
            <span className="font-medium">{lineups.away_team.team_name}:</span>
            <span className="ml-2">
              {lineups.away_team.starters.length} titulares,{" "}
              {lineups.away_team.substitutes.length} suplentes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
