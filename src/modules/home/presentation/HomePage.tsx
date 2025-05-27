import { Button } from "@/ui-lib/atoms/Button";
import { useAuth } from "@/modules/auth/presentation/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            No user information available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user.name || user.fullname || "User"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">User Information</h3>
          <div className="space-y-2 text-sm">
            {(user.name || user.fullname) && (
              <p>
                <span className="font-medium">Name:</span>{" "}
                {user.name || user.fullname}
              </p>
            )}
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {user.username && (
              <p>
                <span className="font-medium">Username:</span> {user.username}
              </p>
            )}
            {user.phone && (
              <p>
                <span className="font-medium">Phone:</span> {user.phone}
              </p>
            )}
            {user.role && (
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
            )}
            {user.id && (
              <p>
                <span className="font-medium">ID:</span> {user.id}
              </p>
            )}
            {user.created_at && (
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigate("/tournaments/create")}
            >
              Crear Torneo
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/tournaments")}
            >
              Ver Torneos
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/teams")}
            >
              Ver Equipos
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/teams/create")}
            >
              Crear Equipo
            </Button>
          </div>
        </div>

        <div className="p-6 border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Total Tournaments:</span> 0
            </p>
            <p>
              <span className="font-medium">Active Tournaments:</span> 0
            </p>
            <p>
              <span className="font-medium">Total Participants:</span> 0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
