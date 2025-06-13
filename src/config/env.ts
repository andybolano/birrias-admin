// Configuración centralizada de variables de entorno
export const env = {
  API_URL:
    import.meta.env.VITE_API_URL || "https://birrias-api.onrender.com/api",
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === "development",
  IS_PRODUCTION: import.meta.env.NODE_ENV === "production",
} as const;

// Validar que las variables requeridas estén presentes
export const validateEnv = () => {
  const requiredVars = {
    API_URL: env.API_URL,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

export default env;
