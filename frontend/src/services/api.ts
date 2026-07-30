import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
const ACCESS_TOKEN_KEY = "linkup.access-token";
const REFRESH_TOKEN_KEY = "linkup.refresh-token";

interface RefreshResponse {
  access: string;
  refresh?: string;
}

interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const getStoredValue = (key: string) => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
};

export const getAccessToken = () => getStoredValue(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => getStoredValue(REFRESH_TOKEN_KEY);

const hasPersistentSession = () =>
  typeof window !== "undefined" &&
  window.localStorage.getItem(REFRESH_TOKEN_KEY) !== null;

export function storeTokens(
  tokens: RefreshResponse,
  remember = hasPersistentSession(),
) {
  if (typeof window === "undefined") return;
  const targetStorage = remember ? window.localStorage : window.sessionStorage;
  const otherStorage = remember ? window.sessionStorage : window.localStorage;
  targetStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  if (tokens.refresh) targetStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const response = await axios.post<RefreshResponse>(
      `${API_BASE_URL}/auth/token/refresh/`,
      { refresh },
    );
    storeTokens(response.data);
    return response.data.access;
  } catch {
    clearTokens();
    window.dispatchEvent(new Event("linkup:auth-expired"));
    return null;
  }
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config as RetriableRequest | undefined;
    const isAuthRequest = request?.url?.includes("/auth/");

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    request._retry = true;
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const accessToken = await refreshPromise;
    if (!accessToken) return Promise.reject(error);

    request.headers.Authorization = `Bearer ${accessToken}`;
    return api(request);
  },
);

export default api;
