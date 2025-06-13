import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Select } from "@/ui-lib/atoms/Select";
import { Checkbox } from "@/ui-lib/atoms/Checkbox";
import { useTournamentPhases } from "../application/hooks/useTournamentPhases";
import { useTournamentPhaseTypes } from "../application/hooks/useTournamentPhaseTypes";
import type {
  TournamentPhaseResponse,
  TournamentPhaseType,
  CreateTournamentPhaseRequest,
} from "../domain/types";

interface TournamentPhasesManagerProps {
  tournamentId: string;
}

export const TournamentPhasesManager: React.FC<
  TournamentPhasesManagerProps
> = ({ tournamentId }) => {
  const {
    phases,
    loading,
    creating,
    updating,
    error,
    createPhase,
    updatePhase,
    generateFixtures,
  } = useTournamentPhases(tournamentId);
  const { phaseTypes, loading: typesLoading } = useTournamentPhaseTypes();
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

  const handleCreatePhase = async (phaseData: CreateTournamentPhaseRequest) => {
    try {
      await createPhase(phaseData);
      setIsAddingPhase(false);
    } catch (error) {
      console.error("Error creating phase:", error);
    }
  };

  const handleUpdatePhase = async (
    phaseId: string,
    phaseData: CreateTournamentPhaseRequest
  ) => {
    try {
      await updatePhase(phaseId, phaseData);
      setEditingPhaseId(null);
    } catch (error) {
      console.error("Error updating phase:", error);
    }
  };

  const handleGenerateFixtures = async (phaseId: string) => {
    try {
      await generateFixtures(phaseId);
    } catch (error) {
      console.error("Error generating fixtures:", error);
    }
  };

  if (loading || typesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando fases del torneo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {creating && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800">Creando nueva fase...</p>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Fases del Torneo
            </h3>
            <p className="text-sm text-gray-600">
              Configura las fases del torneo. Cada fase se ejecuta
              secuencialmente.
            </p>
          </div>
          <Button
            onClick={() => setIsAddingPhase(true)}
            variant="outline"
            size="sm"
            disabled={isAddingPhase || creating}
          >
            Agregar Fase
          </Button>
        </div>

        {/* Add New Phase Form */}
        {isAddingPhase && (
          <div className="mb-6">
            <NewPhaseForm
              phaseTypes={phaseTypes}
              onSave={handleCreatePhase}
              onCancel={() => setIsAddingPhase(false)}
              isCreating={creating}
            />
          </div>
        )}

        {/* Phases List */}
        {(!phases || phases.length === 0) && !isAddingPhase ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay fases configuradas.</p>
            <p className="text-sm">Haz clic en "Agregar Fase" para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {phases?.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                phaseTypes={phaseTypes || []}
                isEditing={editingPhaseId === phase.id}
                isUpdating={updating}
                onEdit={() => setEditingPhaseId(phase.id)}
                onCancelEdit={() => setEditingPhaseId(null)}
                onUpdate={(phaseData) => handleUpdatePhase(phase.id, phaseData)}
                onGenerateFixtures={() => handleGenerateFixtures(phase.id)}
              />
            ))}
          </div>
        )}
      </div>

      {phases && phases.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-green-800 font-medium">
              {phases.length} fase{phases.length !== 1 ? "s" : ""} configurada
              {phases.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Las fases se ejecutarán en el orden mostrado.
          </p>
        </div>
      )}
    </div>
  );
};

interface NewPhaseFormProps {
  phaseTypes: TournamentPhaseType[];
  onSave: (phase: CreateTournamentPhaseRequest) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const NewPhaseForm: React.FC<NewPhaseFormProps> = ({
  phaseTypes,
  onSave,
  onCancel,
  isCreating,
}) => {
  const [formData, setFormData] = useState<CreateTournamentPhaseRequest>({
    name: "",
    type: "",
    home_away: false,
    config: {},
  });

  const selectedPhaseType = phaseTypes?.find(
    (type) => type.value === formData.type
  );

  const handleFieldChange = (
    field: keyof CreateTournamentPhaseRequest,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Clean up the data before sending
    const cleanData: CreateTournamentPhaseRequest = {
      name: formData.name.trim(),
      type: formData.type,
      home_away: formData.home_away,
    };

    // Add optional fields only if they have values
    if (formData.teams_advance && formData.teams_advance > 0) {
      cleanData.teams_advance = formData.teams_advance;
    }
    if (formData.groups_count && formData.groups_count > 0) {
      cleanData.groups_count = formData.groups_count;
    }
    if (formData.teams_per_group && formData.teams_per_group > 0) {
      cleanData.teams_per_group = formData.teams_per_group;
    }
    if (formData.config && Object.keys(formData.config).length > 0) {
      cleanData.config = formData.config;
    }

    onSave(cleanData);
  };

  const isValid = formData.name.trim() && formData.type;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Nueva Fase</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phase-name">Nombre de la Fase</Label>
            <Input
              id="phase-name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Ej: Fase de Grupos"
            />
          </div>
          <div>
            <Label htmlFor="phase-type">Tipo de Fase</Label>
            <Select
              id="phase-type"
              value={formData.type}
              onChange={(e) => handleFieldChange("type", e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              {(phaseTypes || [])
                .filter((type) =>
                  ["single_elimination", "groups", "round_robin"].includes(
                    type.value
                  )
                )
                .map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
            </Select>
          </div>
        </div>

        {selectedPhaseType && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {selectedPhaseType.description}
            </p>

            {/* Home/Away option - for all types that support it */}
            {(formData.type === "round_robin" ||
              formData.type === "single_elimination") && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="home-away"
                  checked={formData.home_away || false}
                  onChange={(e) =>
                    handleFieldChange("home_away", e.target.checked)
                  }
                />
                <Label htmlFor="home-away">Partidos de ida y vuelta</Label>
              </div>
            )}

            {/* Teams advance - for all types */}
            <div>
              <Label htmlFor="teams-advance">
                Equipos que avanzan a la siguiente fase
              </Label>
              <Input
                id="teams-advance"
                type="number"
                min="1"
                value={formData.teams_advance || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "teams_advance",
                    parseInt(e.target.value) || undefined
                  )
                }
                placeholder="Número de equipos"
              />
            </div>

            {/* Groups configuration - only for groups type */}
            {formData.type === "groups" && (
              <>
                <div>
                  <Label htmlFor="groups-count">Número de Grupos</Label>
                  <Input
                    id="groups-count"
                    type="number"
                    min="1"
                    value={formData.groups_count || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "groups_count",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="4"
                  />
                </div>
                <div>
                  <Label htmlFor="teams-per-group">Equipos por Grupo</Label>
                  <Input
                    id="teams-per-group"
                    type="number"
                    min="2"
                    value={formData.teams_per_group || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "teams_per_group",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="4"
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isValid || isCreating}
          >
            {isCreating ? "Creando..." : "Crear Fase"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PhaseCardProps {
  phase: TournamentPhaseResponse;
  phaseTypes: TournamentPhaseType[];
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (phaseData: CreateTournamentPhaseRequest) => void;
  onGenerateFixtures: () => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  phaseTypes,
  isEditing,
  isUpdating,
  onEdit,
  onCancelEdit,
  onUpdate,
  onGenerateFixtures,
}) => {
  const phaseType = phaseTypes?.find((type) => type.value === phase.type);

  if (isEditing) {
    return (
      <EditPhaseForm
        phase={phase}
        phaseTypes={phaseTypes}
        onSave={onUpdate}
        onCancel={onCancelEdit}
        isUpdating={isUpdating}
      />
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              Fase {phase.order}
            </span>
            <h4 className="font-medium text-gray-900">{phase.name}</h4>
            {phase.is_active && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                Activa
              </span>
            )}
            {phase.is_completed && (
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                Completada
              </span>
            )}
          </div>

          {phaseType && (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tipo:</span> {phaseType.label}
              </p>
              <p className="text-sm text-gray-500">{phaseType.description}</p>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Configuración:</span>
                <ul className="list-disc list-inside ml-2">
                  {phase.home_away && <li>Partidos de ida y vuelta</li>}
                  {phase.teams_advance && (
                    <li>Equipos que avanzan: {phase.teams_advance}</li>
                  )}
                  {phase.groups_count && <li>Grupos: {phase.groups_count}</li>}
                  {phase.teams_per_group && (
                    <li>Equipos por grupo: {phase.teams_per_group}</li>
                  )}
                </ul>
              </div>

              {phase.matches_count !== undefined && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Partidos:</span>{" "}
                  {phase.matches_count}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!phase.is_completed && (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={onGenerateFixtures}>
                Generar Fixtures
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface EditPhaseFormProps {
  phase: TournamentPhaseResponse;
  phaseTypes: TournamentPhaseType[];
  onSave: (phase: CreateTournamentPhaseRequest) => void;
  onCancel: () => void;
  isUpdating: boolean;
}

const EditPhaseForm: React.FC<EditPhaseFormProps> = ({
  phase,
  phaseTypes,
  onSave,
  onCancel,
  isUpdating,
}) => {
  const [formData, setFormData] = useState<CreateTournamentPhaseRequest>({
    name: phase.name,
    type: phase.type,
    home_away: phase.home_away || false,
    teams_advance: phase.teams_advance,
    groups_count: phase.groups_count,
    teams_per_group: phase.teams_per_group,
    config: phase.config || {},
  });

  const selectedPhaseType = phaseTypes?.find(
    (type) => type.value === formData.type
  );

  const handleFieldChange = (
    field: keyof CreateTournamentPhaseRequest,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Clean up the data before sending
    const cleanData: CreateTournamentPhaseRequest = {
      name: formData.name.trim(),
      type: formData.type,
      home_away: formData.home_away,
    };

    // Add optional fields only if they have values
    if (formData.teams_advance && formData.teams_advance > 0) {
      cleanData.teams_advance = formData.teams_advance;
    }
    if (formData.groups_count && formData.groups_count > 0) {
      cleanData.groups_count = formData.groups_count;
    }
    if (formData.teams_per_group && formData.teams_per_group > 0) {
      cleanData.teams_per_group = formData.teams_per_group;
    }
    if (formData.config && Object.keys(formData.config).length > 0) {
      cleanData.config = formData.config;
    }

    onSave(cleanData);
  };

  const isValid = formData.name.trim() && formData.type;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Editar Fase</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-phase-name">Nombre de la Fase</Label>
            <Input
              id="edit-phase-name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Ej: Fase de Grupos"
            />
          </div>
          <div>
            <Label htmlFor="edit-phase-type">Tipo de Fase</Label>
            <Select
              id="edit-phase-type"
              value={formData.type}
              onChange={(e) => handleFieldChange("type", e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              {(phaseTypes || [])
                .filter((type) =>
                  ["single_elimination", "groups", "round_robin"].includes(
                    type.value
                  )
                )
                .map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
            </Select>
          </div>
        </div>

        {selectedPhaseType && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {selectedPhaseType.description}
            </p>

            {/* Home/Away option - for all types that support it */}
            {(formData.type === "round_robin" ||
              formData.type === "single_elimination") && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-home-away"
                  checked={formData.home_away || false}
                  onChange={(e) =>
                    handleFieldChange("home_away", e.target.checked)
                  }
                />
                <Label htmlFor="edit-home-away">Partidos de ida y vuelta</Label>
              </div>
            )}

            {/* Teams advance - for all types */}
            <div>
              <Label htmlFor="edit-teams-advance">
                Equipos que avanzan a la siguiente fase
              </Label>
              <Input
                id="edit-teams-advance"
                type="number"
                min="1"
                value={formData.teams_advance || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "teams_advance",
                    parseInt(e.target.value) || undefined
                  )
                }
                placeholder="Número de equipos"
              />
            </div>

            {/* Groups configuration - only for groups type */}
            {formData.type === "groups" && (
              <>
                <div>
                  <Label htmlFor="edit-groups-count">Número de Grupos</Label>
                  <Input
                    id="edit-groups-count"
                    type="number"
                    min="1"
                    value={formData.groups_count || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "groups_count",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="4"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-teams-per-group">
                    Equipos por Grupo
                  </Label>
                  <Input
                    id="edit-teams-per-group"
                    type="number"
                    min="2"
                    value={formData.teams_per_group || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "teams_per_group",
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="4"
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isValid || isUpdating}
          >
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
};
