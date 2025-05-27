import { request } from "@/core/request";
import { authStorage, userStorage } from "@/lib/session-storage";
import {
  type LoginCredentials,
  type RegisterCredentials,
  type User,
  type AuthResponse,
  type RegisterResponse,
  type LoginResponse,
} from "@/modules/auth/domain/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await request.post<LoginResponse>("/login", credentials);

    if (data.access_token && data.user) {
      authStorage.setToken(data.access_token);
      userStorage.setUser(data.user);
      return data.user;
    }

    throw new Error("Login failed: Invalid response");
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const { data } = await request.post<RegisterResponse>(
      "/register",
      credentials
    );

    if (data.access_token && data.user) {
      authStorage.setToken(data.access_token);
      userStorage.setUser(data.user);
      return data.user;
    }

    throw new Error("Registration failed: Invalid response");
  },

  async logout(): Promise<void> {
    authStorage.removeToken();
    userStorage.removeUser();
  },

  async getCurrentUser(): Promise<User> {
    // Primero intentar obtener el usuario del storage
    const storedUser = userStorage.getUser<User>();
    if (storedUser) {
      return storedUser;
    }

    // Si no está en storage, hacer petición a la API
    const { data } = await request.get<{ user: User }>("/me");
    userStorage.setUser(data.user);
    return data.user;
  },

  async refreshToken(): Promise<void> {
    try {
      const { data } = await request.post<AuthResponse>("/refresh");
      if (data.ok && data.session) {
        authStorage.setToken(data.session.access_token);
        userStorage.setUser(data.session.user);
      }
    } catch (error) {
      // Si falla el refresh, limpiar el storage
      authStorage.removeToken();
      userStorage.removeUser();
      throw error;
    }
  },
};
