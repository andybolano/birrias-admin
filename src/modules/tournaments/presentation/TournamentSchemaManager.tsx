import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Select } from "@/ui-lib/atoms/Select";
import { Checkbox } from "@/ui-lib/atoms/Checkbox";
import { useTournamentPhaseTypes } from "../application/hooks/useTournamentPhaseTypes";
import type {
  TournamentPhase,
  TournamentPhaseType,
  TournamentSchema,
} from "../domain/types";

interface TournamentSchemaManagerProps {
  schema: TournamentSchema;
  onSchemaChange: (schema: TournamentSchema) => void;
}

export const TournamentSchemaManager: React.FC<
  TournamentSchemaManagerProps
> = ({ schema, onSchemaChange }) => {
  const { phaseTypes, loading, error } = useTournamentPhaseTypes();
  const [editingPhase, setEditingPhase] = useState<number | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);

  const addPhase = () => {
    setIsAddingPhase(true);
  };

  const cancelAddPhase = () => {
    setIsAddingPhase(false);
  };

  const saveNewPhase = (newPhase: TournamentPhase) => {
    const phaseWithOrder = {
      ...newPhase,
      order: schema.phases.length + 1,
    };

    onSchemaChange({
      phases: [...schema.phases, phaseWithOrder],
    });
    setIsAddingPhase(false);
  };

  const updatePhase = (index: number, updatedPhase: TournamentPhase) => {
    const updatedPhases = [...schema.phases];
    updatedPhases[index] = updatedPhase;
    onSchemaChange({
      phases: updatedPhases,
    });
  };

  const removePhase = (index: number) => {
    const updatedPhases = schema.phases.filter((_, i) => i !== index);
    // Reorder phases
    const reorderedPhases = updatedPhases.map((phase, i) => ({
      ...phase,
      order: i + 1,
    }));
    onSchemaChange({
      phases: reorderedPhases,
    });
    setEditingPhase(null);
  };

  const movePhase = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === schema.phases.length - 1)
    ) {
      return;
    }

    const updatedPhases = [...schema.phases];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap phases
    [updatedPhases[index], updatedPhases[targetIndex]] = [
      updatedPhases[targetIndex],
      updatedPhases[index],
    ];

    // Update order
    updatedPhases.forEach((phase, i) => {
      phase.order = i + 1;
    });

    onSchemaChange({
      phases: updatedPhases,
    });
  };

  const getPhaseTypeByValue = (
    value: string
  ): TournamentPhaseType | undefined => {
    return phaseTypes.find((type) => type.value === value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando tipos de fases...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Esquema del Torneo
        </h3>
        <Button
          onClick={addPhase}
          variant="outline"
          size="sm"
          disabled={isAddingPhase}
        >
          Agregar Fase
        </Button>
      </div>

      {/* Add New Phase Form */}
      {isAddingPhase && (
        <NewPhaseForm
          phaseTypes={phaseTypes}
          onSave={saveNewPhase}
          onCancel={cancelAddPhase}
          getPhaseTypeByValue={getPhaseTypeByValue}
        />
      )}

      {schema.phases.length === 0 && !isAddingPhase ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay fases configuradas.</p>
          <p className="text-sm">Haz clic en "Agregar Fase" para comenzar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schema.phases.map((phase, index) => (
            <PhaseCard
              key={index}
              phase={phase}
              index={index}
              phaseTypes={phaseTypes}
              isEditing={editingPhase === index}
              onEdit={() => setEditingPhase(index)}
              onSave={() => setEditingPhase(null)}
              onCancel={() => setEditingPhase(null)}
              onUpdate={(updatedPhase) => updatePhase(index, updatedPhase)}
              onRemove={() => removePhase(index)}
              onMoveUp={() => movePhase(index, "up")}
              onMoveDown={() => movePhase(index, "down")}
              canMoveUp={index > 0}
              canMoveDown={index < schema.phases.length - 1}
              getPhaseTypeByValue={getPhaseTypeByValue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PhaseCardProps {
  phase: TournamentPhase;
  index: number;
  phaseTypes: TournamentPhaseType[];
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (phase: TournamentPhase) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  getPhaseTypeByValue: (value: string) => TournamentPhaseType | undefined;
}

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  index,
  phaseTypes,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  getPhaseTypeByValue,
}) => {
  const [localPhase, setLocalPhase] = useState<TournamentPhase>(phase);
  const selectedPhaseType = getPhaseTypeByValue(localPhase.type);

  const handleFieldChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setLocalPhase((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (
    key: string,
    value: string | number | boolean
  ) => {
    setLocalPhase((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    onUpdate(localPhase);
    onSave();
  };

  const handleCancel = () => {
    setLocalPhase(phase);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`phase-name-${index}`}>Nombre de la Fase</Label>
              <Input
                id={`phase-name-${index}`}
                value={localPhase.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Ej: Fase de Grupos"
              />
            </div>
            <div>
              <Label htmlFor={`phase-type-${index}`}>Tipo de Fase</Label>
              <Select
                id={`phase-type-${index}`}
                value={localPhase.type}
                onChange={(e) => handleFieldChange("type", e.target.value)}
              >
                <option value="">Selecciona un tipo</option>
                {phaseTypes.map((type) => (
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

              {/* Render configuration options */}
              {Object.entries(selectedPhaseType.config_options).map(
                ([key, label]) => (
                  <div key={key}>
                    <Label htmlFor={`config-${key}-${index}`}>{label}</Label>
                    <Input
                      id={`config-${key}-${index}`}
                      type="number"
                      min="1"
                      value={String(localPhase.config[key] || "")}
                      onChange={(e) =>
                        handleConfigChange(key, parseInt(e.target.value) || "")
                      }
                      placeholder="Ingresa un valor"
                    />
                  </div>
                )
              )}

              {/* Render optional fields */}
              {selectedPhaseType.optional_fields.map((field) => {
                if (
                  field === "home_away" &&
                  selectedPhaseType.supports_home_away
                ) {
                  return (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field}-${index}`}
                        checked={Boolean(localPhase.config[field])}
                        onChange={(e) =>
                          handleConfigChange(field, e.target.checked)
                        }
                      />
                      <Label htmlFor={`${field}-${index}`}>
                        Partidos de ida y vuelta
                      </Label>
                    </div>
                  );
                }

                if (field === "teams_advance") {
                  return (
                    <div key={field}>
                      <Label htmlFor={`${field}-${index}`}>
                        Equipos que avanzan a la siguiente fase
                      </Label>
                      <Input
                        id={`${field}-${index}`}
                        type="number"
                        min="1"
                        value={String(localPhase.config[field] || "")}
                        onChange={(e) =>
                          handleConfigChange(
                            field,
                            parseInt(e.target.value) || ""
                          )
                        }
                        placeholder="Número de equipos"
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!localPhase.name.trim() || !localPhase.type}
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>
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
          </div>

          {selectedPhaseType && (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tipo:</span>{" "}
                {selectedPhaseType.label}
              </p>
              <p className="text-sm text-gray-500">
                {selectedPhaseType.description}
              </p>

              {Object.keys(phase.config).length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Configuración:</span>
                  <ul className="list-disc list-inside ml-2">
                    {Object.entries(phase.config).map(([key, value]) => {
                      const label =
                        selectedPhaseType.config_options[key] || key;
                      return (
                        <li key={key}>
                          {label}: {String(value)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Mover hacia arriba"
          >
            ↑
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Mover hacia abajo"
          >
            ↓
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onRemove}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

interface NewPhaseFormProps {
  phaseTypes: TournamentPhaseType[];
  onSave: (phase: TournamentPhase) => void;
  onCancel: () => void;
  getPhaseTypeByValue: (value: string) => TournamentPhaseType | undefined;
}

const NewPhaseForm: React.FC<NewPhaseFormProps> = ({
  phaseTypes,
  onSave,
  onCancel,
  getPhaseTypeByValue,
}) => {
  const [newPhase, setNewPhase] = useState<TournamentPhase>({
    name: "",
    type: "",
    order: 1,
    config: {},
  });

  const selectedPhaseType = getPhaseTypeByValue(newPhase.type);

  const handleFieldChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setNewPhase((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (
    key: string,
    value: string | number | boolean
  ) => {
    setNewPhase((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(newPhase);
  };

  const isValid = newPhase.name.trim() && newPhase.type;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Nueva Fase</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-phase-name">Nombre de la Fase</Label>
            <Input
              id="new-phase-name"
              value={newPhase.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Ej: Fase de Grupos"
            />
          </div>
          <div>
            <Label htmlFor="new-phase-type">Tipo de Fase</Label>
            <Select
              id="new-phase-type"
              value={newPhase.type}
              onChange={(e) => handleFieldChange("type", e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              {phaseTypes.map((type) => (
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

            {/* Render configuration options */}
            {Object.entries(selectedPhaseType.config_options).map(
              ([key, label]) => (
                <div key={key}>
                  <Label htmlFor={`new-config-${key}`}>{label}</Label>
                  <Input
                    id={`new-config-${key}`}
                    type="number"
                    min="1"
                    value={String(newPhase.config[key] || "")}
                    onChange={(e) =>
                      handleConfigChange(key, parseInt(e.target.value) || "")
                    }
                    placeholder="Ingresa un valor"
                  />
                </div>
              )
            )}

            {/* Render optional fields */}
            {selectedPhaseType.optional_fields.map((field) => {
              if (
                field === "home_away" &&
                selectedPhaseType.supports_home_away
              ) {
                return (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`new-${field}`}
                      checked={Boolean(newPhase.config[field])}
                      onChange={(e) =>
                        handleConfigChange(field, e.target.checked)
                      }
                    />
                    <Label htmlFor={`new-${field}`}>
                      Partidos de ida y vuelta
                    </Label>
                  </div>
                );
              }

              if (field === "teams_advance") {
                return (
                  <div key={field}>
                    <Label htmlFor={`new-${field}`}>
                      Equipos que avanzan a la siguiente fase
                    </Label>
                    <Input
                      id={`new-${field}`}
                      type="number"
                      min="1"
                      value={String(newPhase.config[field] || "")}
                      onChange={(e) =>
                        handleConfigChange(
                          field,
                          parseInt(e.target.value) || ""
                        )
                      }
                      placeholder="Número de equipos"
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!isValid}>
            Agregar Fase
          </Button>
        </div>
      </div>
    </div>
  );
};
