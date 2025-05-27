export interface User {
  id?: number;
  name?: string;
  fullname?: string;
  email: string;
  username?: string;
  phone?: string;
  role?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthResponse {
  ok: boolean;
  user_id: string;
  session: Session;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  phone: string;
}
