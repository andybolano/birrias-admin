import storage from "./sessionStorage";

// Funciones específicas para el token de autenticación
export const authStorage = {
  getToken: (): string | null => storage.get<string>("token"),
  setToken: (token: string): void => storage.set("token", token),
  removeToken: (): void => storage.remove("token"),
};

// Funciones específicas para datos de usuario
export const userStorage = {
  getUser: <T>(): T | null => {
    const user = storage.get<T>("user");
    return user as T | null;
  },
  setUser: (user: unknown): void => storage.set("user", user),
  removeUser: (): void => storage.remove("user"),
};

// Funciones generales de storage
export const appStorage = {
  get: <T>(key: string): T | string | null => storage.get<T>(key),
  set: (key: string, value: unknown): void => storage.set(key, value),
  remove: (key: string): void => storage.remove(key),
  clear: (): void => storage.clear(),
};

// Exportar el storage completo por defecto
export default storage;
