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

export const CreateTeamForm: React.FC = () => {
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
      alert("Por favor, ingresa el nombre del equipo");
      return;
    }

    try {
      const requestData: CreateTeamRequest = {
        name: formData.name.trim(),
      };

      if (formData.shield) {
        requestData.shield = formData.shield;
      }

      const team = await createTeam(requestData);
      alert("Equipo creado exitosamente");
      setFormData(initialFormData);
      console.log("Team created:", team);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Crear Nuevo Equipo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Información del Equipo
            </h2>

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
              <p className="mt-1 text-sm text-gray-500">
                Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
              </p>
            </div>
          </div>

          {/* Error de creación */}
          {createError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{createError}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(initialFormData)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createLoading || !validateForm()}>
              {createLoading ? "Creando..." : "Crear Equipo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
