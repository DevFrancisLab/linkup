import { createContext } from "react";
import type {
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "@/services/auth";

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: Partial<AuthUser> | FormData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
