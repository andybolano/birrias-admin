import React, { useState, useEffect } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { Select } from "@/ui-lib/atoms/Select";
import { Checkbox } from "@/ui-lib/atoms/Checkbox";
import { useTournamentFormats } from "../application/hooks/useTournamentFormats";
import { useCreateTournament } from "../application/hooks/useCreateTournament";
import type {
  CreateTournamentRequest,
  TournamentFormat,
} from "../domain/types";

interface FormData {
  name: string;
  start_date: string;
  inscription_fee_money: string;
  currency: string;
  format: string;
  groups: string;
  teams_per_group: string;
  playoff_size: string;
  rounds: string;
  home_away: boolean;
}

const initialFormData: FormData = {
  name: "",
  start_date: "",
  inscription_fee_money: "",
  currency: "USD",
  format: "",
  groups: "",
  teams_per_group: "",
  playoff_size: "",
  rounds: "",
  home_away: false,
};

export const CreateTournamentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedFormat, setSelectedFormat] = useState<TournamentFormat | null>(
    null
  );

  const {
    formats,
    loading: formatsLoading,
    error: formatsError,
  } = useTournamentFormats();
  const {
    createTournament,
    loading: createLoading,
    error: createError,
  } = useCreateTournament();

  useEffect(() => {
    if (formData.format && formats.length > 0) {
      const format = formats.find((f) => f.value === formData.format);
      setSelectedFormat(format || null);
    } else {
      setSelectedFormat(null);
    }
  }, [formData.format, formats]);

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

  const isFieldRequired = (fieldName: string): boolean => {
    return selectedFormat?.required_params.includes(fieldName) || false;
  };

  const isFieldOptional = (fieldName: string): boolean => {
    return selectedFormat?.optional_params.includes(fieldName) || false;
  };

  const shouldShowField = (fieldName: string): boolean => {
    if (!selectedFormat) return false;
    return isFieldRequired(fieldName) || isFieldOptional(fieldName);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) return false;
    if (!formData.start_date) return false;
    if (
      !formData.inscription_fee_money ||
      parseFloat(formData.inscription_fee_money) <= 0
    )
      return false;
    if (!formData.format) return false;

    if (!selectedFormat) return false;

    // Validar campos requeridos según el formato
    for (const param of selectedFormat.required_params) {
      const value = formData[param as keyof FormData];
      if (param === "home_away") {
        // home_away es boolean, no necesita validación especial
        continue;
      }
      if (!value || (typeof value === "string" && !value.trim())) {
        return false;
      }
    }

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
        format: formData.format,
      };

      // Agregar campos opcionales y requeridos según el formato
      if (shouldShowField("groups") && formData.groups) {
        requestData.groups = parseInt(formData.groups);
      }
      if (shouldShowField("teams_per_group") && formData.teams_per_group) {
        requestData.teams_per_group = parseInt(formData.teams_per_group);
      }
      if (shouldShowField("playoff_size") && formData.playoff_size) {
        requestData.playoff_size = parseInt(formData.playoff_size);
      }
      if (shouldShowField("rounds") && formData.rounds) {
        requestData.rounds = parseInt(formData.rounds);
      }
      if (shouldShowField("home_away")) {
        requestData.home_away = formData.home_away;
      }

      const tournament = await createTournament(requestData);
      alert("Torneo creado exitosamente");
      setFormData(initialFormData);
      console.log("Tournament created:", tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  if (formatsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando formatos...
          </p>
        </div>
      </div>
    );
  }

  if (formatsError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{formatsError}</p>
        </div>
      </div>
    );
  }

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

          {/* Formato del torneo */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Formato del Torneo
            </h2>

            <div>
              <Label htmlFor="format">Formato *</Label>
              <Select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un formato</option>
                {formats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </Select>
              {selectedFormat && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedFormat.description}
                </p>
              )}
            </div>
          </div>

          {/* Configuración específica del formato */}
          {selectedFormat && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Configuración del Formato
              </h2>

              {shouldShowField("rounds") && (
                <div>
                  <Label htmlFor="rounds">
                    Número de Vueltas{" "}
                    {isFieldRequired("rounds") ? "*" : "(Opcional)"}
                  </Label>
                  <Input
                    id="rounds"
                    name="rounds"
                    type="number"
                    min="1"
                    value={formData.rounds}
                    onChange={handleInputChange}
                    placeholder="2"
                    required={isFieldRequired("rounds")}
                  />
                </div>
              )}

              {shouldShowField("groups") && (
                <div>
                  <Label htmlFor="groups">
                    Número de Grupos{" "}
                    {isFieldRequired("groups") ? "*" : "(Opcional)"}
                  </Label>
                  <Input
                    id="groups"
                    name="groups"
                    type="number"
                    min="1"
                    value={formData.groups}
                    onChange={handleInputChange}
                    placeholder="4"
                    required={isFieldRequired("groups")}
                  />
                </div>
              )}

              {shouldShowField("teams_per_group") && (
                <div>
                  <Label htmlFor="teams_per_group">
                    Equipos por Grupo{" "}
                    {isFieldRequired("teams_per_group") ? "*" : "(Opcional)"}
                  </Label>
                  <Input
                    id="teams_per_group"
                    name="teams_per_group"
                    type="number"
                    min="2"
                    value={formData.teams_per_group}
                    onChange={handleInputChange}
                    placeholder="4"
                    required={isFieldRequired("teams_per_group")}
                  />
                </div>
              )}

              {shouldShowField("playoff_size") && (
                <div>
                  <Label htmlFor="playoff_size">
                    Tamaño de Playoffs{" "}
                    {isFieldRequired("playoff_size") ? "*" : "(Opcional)"}
                  </Label>
                  <Input
                    id="playoff_size"
                    name="playoff_size"
                    type="number"
                    min="2"
                    value={formData.playoff_size}
                    onChange={handleInputChange}
                    placeholder="8"
                    required={isFieldRequired("playoff_size")}
                  />
                </div>
              )}

              {shouldShowField("home_away") && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="home_away"
                    name="home_away"
                    checked={formData.home_away}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="home_away">
                    Partidos de ida y vuelta{" "}
                    {isFieldRequired("home_away") ? "*" : "(Opcional)"}
                  </Label>
                </div>
              )}
            </div>
          )}

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
