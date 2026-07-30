import { type ReactNode, useEffect, useMemo, useState } from "react";
import { authService, type AuthUser } from "@/services/auth";
import { clearTokens, getAccessToken, getRefreshToken } from "@/services/api";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getAccessToken() && !getRefreshToken()) {
        setIsLoading(false);
        return;
      }
      try {
        setUser(await authService.getProfile());
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    const handleExpiredSession = () => {
      clearTokens();
      setUser(null);
      setIsLoading(false);
    };

    void restoreSession();
    window.addEventListener("linkup:auth-expired", handleExpiredSession);
    return () =>
      window.removeEventListener("linkup:auth-expired", handleExpiredSession);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      async login(credentials) {
        setUser(await authService.login(credentials));
      },
      async register(payload, remember) {
        await authService.register(payload);
        setUser(
          await authService.login({
            identifier: payload.username,
            password: payload.password,
            remember,
          }),
        );
      },
      async logout() {
        await authService.logout();
        setUser(null);
      },
      async refreshProfile() {
        setUser(await authService.getProfile());
      },
      async updateProfile(payload) {
        setUser(await authService.updateProfile(payload));
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
