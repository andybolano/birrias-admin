import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./components/BottomNavigation";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};
