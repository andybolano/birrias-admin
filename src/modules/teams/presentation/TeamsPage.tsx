import React, { useState, useRef } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { DrawerWrapper as Drawer } from "@/ui-lib/atoms/DrawerWrapper";
import { TeamsList } from "./TeamsList";
import { CreateTeamDrawer } from "./CreateTeamDrawer";

export const TeamsPage: React.FC = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const refetchTeamsRef = useRef<(() => void) | null>(null);

  const handleRefetchReady = (refetch: () => void) => {
    refetchTeamsRef.current = refetch;
  };

  const handleCreateSuccess = () => {
    setIsCreateDrawerOpen(false);
    // Refresh the teams list
    if (refetchTeamsRef.current) {
      refetchTeamsRef.current();
    }
  };

  const handleCreateCancel = () => {
    setIsCreateDrawerOpen(false);
  };

  return (
    <>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Equipos</h1>
          <Button variant="default" onClick={() => setIsCreateDrawerOpen(true)}>
            Crear Nuevo Equipo
          </Button>
        </div>

        <TeamsList onRefetchReady={handleRefetchReady} />
      </div>

      {/* Create Team Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={handleCreateCancel}
        title="Crear Equipo"
      >
        <CreateTeamDrawer
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </Drawer>
    </>
  );
};
