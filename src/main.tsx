import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./styles/main.scss";
import { validateEnv } from "./config/env";
import { AuthProvider } from "./modules/auth/presentation/context/AuthContext";

// Validar variables de entorno al inicio
try {
  validateEnv();
} catch (error) {
  console.error("Environment validation failed:", error);
  // En producción, podrías mostrar una página de error
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
