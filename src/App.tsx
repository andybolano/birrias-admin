import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./modules/auth/presentation/LoginForm";
import { RegisterForm } from "./modules/auth/presentation/RegisterForm";
import { HomePage } from "./modules/home/presentation/HomePage";
import { CreateTournamentPage } from "./modules/tournaments/presentation/CreateTournamentPage";
import { TournamentsPage } from "./modules/tournaments/presentation/TournamentsPage";
import { TeamsPage } from "./modules/teams/presentation/TeamsPage";
import { CreateTeamPage } from "./modules/teams/presentation/CreateTeamPage";
import { useAuth } from "./modules/auth/presentation/context/AuthContext";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return (
    <Routes>
      <Route
        path="/auth/login"
        element={
          isAuthenticated
            ? (() => {
                return <Navigate to="/" replace />;
              })()
            : (() => {
                return <LoginForm />;
              })()
        }
      />
      <Route
        path="/auth/register"
        element={
          isAuthenticated
            ? (() => {
                return <Navigate to="/" replace />;
              })()
            : (() => {
                return <RegisterForm />;
              })()
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated
            ? (() => {
                return <HomePage />;
              })()
            : (() => {
                return <Navigate to="/auth/login" replace />;
              })()
        }
      />
      <Route
        path="/tournaments"
        element={
          isAuthenticated
            ? (() => {
                return <TournamentsPage />;
              })()
            : (() => {
                return <Navigate to="/auth/login" replace />;
              })()
        }
      />
      <Route
        path="/tournaments/create"
        element={
          isAuthenticated
            ? (() => {
                return <CreateTournamentPage />;
              })()
            : (() => {
                return <Navigate to="/auth/login" replace />;
              })()
        }
      />
      <Route
        path="/teams"
        element={
          isAuthenticated
            ? (() => {
                return <TeamsPage />;
              })()
            : (() => {
                return <Navigate to="/auth/login" replace />;
              })()
        }
      />
      <Route
        path="/teams/create"
        element={
          isAuthenticated
            ? (() => {
                return <CreateTeamPage />;
              })()
            : (() => {
                return <Navigate to="/auth/login" replace />;
              })()
        }
      />
    </Routes>
  );
};

export default App;
