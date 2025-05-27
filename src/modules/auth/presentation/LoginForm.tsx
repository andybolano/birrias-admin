import { useState } from "react";
import { Button } from "@/ui-lib/atoms/Button";
import { Input } from "@/ui-lib/atoms/Input";
import { Label } from "@/ui-lib/atoms/Label";
import { useAuth } from "./context/AuthContext";
import type { LoginCredentials } from "@/modules/auth/domain/types";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="auth-page flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 backdrop-blur-sm bg-background/80">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Inicia sesión</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede a tu panel de administración
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="tunombre@ejemplo.com"
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Entrar"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No tienes una cuenta?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Crear una cuenta nueva
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
