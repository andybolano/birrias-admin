import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { FileUpload } from "@/ui-lib/atoms/FileUpload";
import { useCreateTeam } from "../application/hooks/useCreateTeam";
import type { CreateTeamRequest } from "../domain/types";

interface FormData {
  name: string;
  shield: File | null;
}

const initialFormData: FormData = {
  name: "",
  shield: null,
};

interface CreateTeamDrawerProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateTeamDrawer: React.FC<CreateTeamDrawerProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const {
    createTeam,
    loading: createLoading,
    error: createError,
  } = useCreateTeam();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, shield: file }));
  };

  const validateForm = (): boolean => {
    return formData.name.trim().length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const requestData: CreateTeamRequest = {
        name: formData.name.trim(),
      };

      if (formData.shield) {
        requestData.shield = formData.shield;
      }

      await createTeam(requestData);
      setFormData(initialFormData);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Crear Nuevo Equipo</h2>
        <p className="text-muted-foreground text-sm">
          Completa la información para crear un nuevo equipo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre del Equipo *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ej: Real Madrid"
            required
          />
        </div>

        <div>
          <Label htmlFor="shield">Escudo del Equipo</Label>
          <FileUpload
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={5}
            placeholder="Seleccionar escudo del equipo"
            className="mt-1"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
          </p>
        </div>

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
            {createLoading ? "Creando..." : "Crear Equipo"}
          </Button>
        </div>
      </form>
    </div>
  );
};
