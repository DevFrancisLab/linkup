import axios from "axios";
import api, { clearTokens, getRefreshToken, storeTokens } from "./api";

export interface AuthUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profession: string;
  company: string;
  bio: string;
  avatar: string | null;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export function getApiErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error) || !error.response?.data) {
    return { non_field_errors: "Unable to reach LinkUp. Please try again." };
  }

  const data = error.response.data as Record<string, string | string[]>;
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
}

export const authService = {
  async register(payload: RegisterPayload) {
    await api.post("/auth/register/", payload);
  },

  async login(credentials: LoginCredentials) {
    const response = await api.post<LoginResponse>("/auth/login/", {
      identifier: credentials.identifier,
      password: credentials.password,
    });
    storeTokens(response.data, credentials.remember);
    return response.data.user;
  },

  async logout() {
    const refresh = getRefreshToken();
    try {
      if (refresh) await api.post("/auth/logout/", { refresh });
    } finally {
      clearTokens();
    }
  },

  async getProfile() {
    const response = await api.get<AuthUser>("/auth/profile/");
    return response.data;
  },

  async updateProfile(payload: Partial<AuthUser> | FormData) {
    const response = await api.put<AuthUser>("/auth/profile/", payload, {
      headers:
        payload instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    });
    return response.data;
  },
};
