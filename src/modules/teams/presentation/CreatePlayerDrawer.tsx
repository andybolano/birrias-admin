import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Select } from "@/ui-lib/atoms/Select";
import { useCreatePlayer } from "../application/hooks/useCreatePlayer";
import type { CreatePlayerRequest } from "../domain/types";

interface FormData {
  position: string;
  jersey: string;
  birthDay: string;
  first_name: string;
  last_name: string;
  identification_number: string;
  eps: string;
}

const initialFormData: FormData = {
  position: "",
  jersey: "",
  birthDay: "",
  first_name: "",
  last_name: "",
  identification_number: "",
  eps: "",
};

const POSITIONS = [
  { value: "goalkeeper", label: "Portero" },
  { value: "defender", label: "Defensor" },
  { value: "midfielder", label: "Mediocampista" },
  { value: "forward", label: "Delantero" },
];

interface CreatePlayerDrawerProps {
  teamId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreatePlayerDrawer: React.FC<CreatePlayerDrawerProps> = ({
  teamId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    createPlayer,
    loading: createLoading,
    error: createError,
  } = useCreatePlayer();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear success message when user changes selection
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const validateForm = (): boolean => {
    return (
      formData.first_name.trim().length > 0 &&
      formData.last_name.trim().length > 0 &&
      formData.position.length > 0 &&
      formData.jersey.length > 0 &&
      formData.birthDay.length > 0 &&
      formData.identification_number.trim().length > 0 &&
      formData.eps.trim().length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const requestData: CreatePlayerRequest = {
        position: formData.position,
        jersey: parseInt(formData.jersey),
        birthDay: formData.birthDay,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        identification_number: formData.identification_number.trim(),
        eps: formData.eps.trim(),
        team_id: teamId,
      };

      await createPlayer(requestData);
      setFormData(initialFormData);
      setSuccessMessage(
        `¡Jugador ${formData.first_name} ${formData.last_name} agregado exitosamente!`
      );

      // Auto close drawer after 2 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Error creating player:", error);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSuccessMessage(null);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Jugador</h2>
        <p className="text-muted-foreground text-sm">
          Completa la información del jugador para agregarlo al equipo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información Personal</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Ej: Juan"
                required
              />
            </div>

            <div>
              <Label htmlFor="last_name">Apellido *</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Ej: Pérez"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="birthDay">Fecha de Nacimiento *</Label>
            <Input
              id="birthDay"
              name="birthDay"
              type="date"
              value={formData.birthDay}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="identification_number">
                Número de Identificación *
              </Label>
              <Input
                id="identification_number"
                name="identification_number"
                type="text"
                value={formData.identification_number}
                onChange={handleInputChange}
                placeholder="Ej: 12345678"
                required
              />
            </div>

            <div>
              <Label htmlFor="eps">EPS *</Label>
              <Input
                id="eps"
                name="eps"
                type="text"
                value={formData.eps}
                onChange={handleInputChange}
                placeholder="Ej: Sura, Nueva EPS, etc."
                required
              />
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información del Equipo</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Posición *</Label>
              <Select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleSelectChange}
                required
              >
                <option value="">Seleccionar posición</option>
                {POSITIONS.map((position) => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="jersey">Número de Camiseta *</Label>
              <Input
                id="jersey"
                name="jersey"
                type="number"
                min="1"
                max="99"
                value={formData.jersey}
                onChange={handleInputChange}
                placeholder="Ej: 10"
                required
              />
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {createError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{createError}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createLoading || !validateForm()}>
            {createLoading ? "Agregando..." : "Agregar Jugador"}
          </Button>
        </div>
      </form>
    </div>
  );
};
