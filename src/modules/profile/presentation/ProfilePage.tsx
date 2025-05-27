import { Button } from "@/ui-lib/atoms/Button";
import { Avatar } from "@/ui-lib/atoms/Avatar";
import { useAuth } from "@/modules/auth/presentation/context/AuthContext";

export const ProfilePage = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
    <div className="container mx-auto p-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Perfil</h1>
          <p className="text-muted-foreground">Información de tu cuenta</p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <Avatar
            fallback={getInitials(
              user?.name || user?.fullname || user?.email || "U"
            )}
            size="lg"
            className="mb-4"
          />
          <h2 className="text-xl font-semibold">
            {user?.name || user?.fullname || "Usuario"}
          </h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        {/* User Information Card */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
          <div className="space-y-4">
            {(user.name || user.fullname) && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium">
                  {user.name || user.fullname}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {user.username && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Usuario:</span>
                <span className="font-medium">{user.username}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
            )}
            {user.role && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rol:</span>
                <span className="font-medium">{user.role}</span>
              </div>
            )}
            {user.created_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Miembro desde:</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Implementar edición de perfil
              console.log("Editar perfil");
            }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar Perfil
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Implementar configuración
              console.log("Configuración");
            }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Configuración
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};
