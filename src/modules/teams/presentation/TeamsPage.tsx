import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { TeamsList } from "./TeamsList";

export const TeamsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
            <Button variant="default" onClick={() => navigate("/teams/create")}>
              Crear Nuevo Equipo
            </Button>
          </div>

          <TeamsList />
        </div>
      </div>
    </div>
  );
};
