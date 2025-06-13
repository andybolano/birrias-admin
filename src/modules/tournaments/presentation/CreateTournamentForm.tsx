import React, { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Select } from "@/ui-lib/atoms/Select";
import { useCreateTournament } from "../application/hooks/useCreateTournament";
import type { CreateTournamentRequest } from "../domain/types";

interface FormData {
  name: string;
  start_date: string;
  inscription_fee_money: string;
  currency: string;
}

const initialFormData: FormData = {
  name: "",
  start_date: "",
  inscription_fee_money: "",
  currency: "USD",
};

export const CreateTournamentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const {
    createTournament,
    loading: createLoading,
    error: createError,
  } = useCreateTournament();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) return false;
    if (!formData.start_date) return false;
    if (
      !formData.inscription_fee_money ||
      parseFloat(formData.inscription_fee_money) <= 0
    )
      return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Por favor, completa todos los campos requeridos");
      return;
    }

    try {
      const requestData: CreateTournamentRequest = {
        name: formData.name.trim(),
        start_date: formData.start_date,
        inscription_fee_money: parseFloat(formData.inscription_fee_money),
        currency: formData.currency,
      };

      const tournament = await createTournament(requestData);
      alert("Torneo creado exitosamente");
      setFormData(initialFormData);
      console.log("Tournament created:", tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Crear Nuevo Torneo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Información Básica
            </h2>

            <div>
              <Label htmlFor="name">Nombre del Torneo *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Liga Birrias 2024"
                required
              />
            </div>

            <div>
              <Label htmlFor="start_date">Fecha de Inicio *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inscription_fee_money">
                  Cuota de Inscripción *
                </Label>
                <Input
                  id="inscription_fee_money"
                  name="inscription_fee_money"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.inscription_fee_money}
                  onChange={handleInputChange}
                  placeholder="150"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda *</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                  <option value="COP">COP</option>
                </Select>
              </div>
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
              {createLoading ? "Creando..." : "Crear Torneo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
