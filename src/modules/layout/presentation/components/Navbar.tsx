import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@/ui-lib/atoms/Avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/ui-lib/atoms/Dropdown";
import { useAuth } from "@/modules/auth/presentation/context/AuthContext";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={closeMobileMenu}
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  B
                </span>
              </div>
              <span className="font-bold text-lg">Birrias Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") && location.pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/tournaments"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/tournaments")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Torneos
            </Link>
            <Link
              to="/teams"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/teams") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Equipos
            </Link>
          </div>

          {/* Right side - User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <Dropdown
                trigger={
                  <Avatar
                    fallback={getInitials(
                      user?.name || user?.fullname || user?.email || "U"
                    )}
                    className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                  />
                }
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {user?.name || user?.fullname || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownSeparator />
                <DropdownItem onClick={handleLogout}>
                  <span className="text-destructive">Cerrar Sesión</span>
                </DropdownItem>
              </Dropdown>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Hamburger icon */}
              <svg
                className={cn("h-6 w-6", isMobileMenuOpen ? "hidden" : "block")}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={cn("h-6 w-6", isMobileMenuOpen ? "block" : "hidden")}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn("md:hidden", isMobileMenuOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t">
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive("/") && location.pathname === "/"
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/tournaments"
              onClick={closeMobileMenu}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive("/tournaments")
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              )}
            >
              Torneos
            </Link>
            <Link
              to="/teams"
              onClick={closeMobileMenu}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive("/teams")
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              )}
            >
              Equipos
            </Link>

            {/* Mobile User Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center px-3 py-2">
                <Avatar
                  fallback={getInitials(
                    user?.name || user?.fullname || user?.email || "U"
                  )}
                  size="sm"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {user?.name || user?.fullname || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-accent transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
