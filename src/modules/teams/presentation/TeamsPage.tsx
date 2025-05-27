import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui-lib/atoms/Button";
import { TeamsList } from "./TeamsList";

export const TeamsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipos</h1>
        <Button variant="default" onClick={() => navigate("/teams/create")}>
          Crear Nuevo Equipo
        </Button>
      </div>

      <TeamsList />
    </div>
  );
};
