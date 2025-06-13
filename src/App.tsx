import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./modules/auth/presentation/LoginForm";
import { RegisterForm } from "./modules/auth/presentation/RegisterForm";
import { HomePage } from "./modules/home/presentation/HomePage";
import { CreateTournamentPage } from "./modules/tournaments/presentation/CreateTournamentPage";
import { TournamentsPage } from "./modules/tournaments/presentation/TournamentsPage";
import { ManageTournamentPage } from "./modules/tournaments/presentation/ManageTournamentPage";
import { TeamsPage } from "./modules/teams/presentation/TeamsPage";
import { CreateTeamPage } from "./modules/teams/presentation/CreateTeamPage";
import { TeamDetailsPage } from "./modules/teams/presentation/TeamDetailsPage";
import { ProfilePage } from "./modules/profile";
import { ProtectedRoute } from "./modules/layout";
import { useAuth } from "./modules/auth/presentation/context/AuthContext";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/auth/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/auth/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />
        }
      />

      {/* Protected Routes with Layout */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<HomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/create" element={<CreateTournamentPage />} />
        <Route
          path="tournaments/:tournamentId/manage"
          element={<ManageTournamentPage />}
        />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="teams/create" element={<CreateTeamPage />} />
        <Route path="teams/:teamId" element={<TeamDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default App;
