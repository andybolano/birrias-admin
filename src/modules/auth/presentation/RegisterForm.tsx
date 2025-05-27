import { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { useAuth } from "./context/AuthContext";
import type { RegisterCredentials } from "@/modules/auth/domain/types";
import { Link } from "react-router-dom";

export const RegisterForm = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: "",
    password: "",
    password_confirmation: "",
    name: "",
    phone: "",
  });

  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(credentials);
      // La redirección se maneja automáticamente en el hook
    } catch (error) {
      // El error se maneja en el hook
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="auth-page flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 backdrop-blur-sm bg-background/80">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Crea tu cuenta de administrador
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tendrás control total sobre tus torneos
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullname">Nombre completo</Label>
            <Input
              id="fullname"
              type="text"
              value={credentials.name}
              onChange={(e) =>
                setCredentials({ ...credentials, name: e.target.value })
              }
              placeholder="Juan Pérez"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="juan@ejemplo.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={credentials.phone}
              onChange={(e) =>
                setCredentials({ ...credentials, phone: e.target.value })
              }
              placeholder="+1234567890"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={credentials.password_confirmation}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password_confirmation: e.target.value,
                })
              }
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Ya tienes una cuenta?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
