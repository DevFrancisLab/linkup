import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { authService, type AuthUser } from "@/services/auth";
import { clearTokens, getAccessToken, getRefreshToken } from "@/services/api";
import { AuthContext, type AuthContextValue } from "./auth-context";

const PROFILE_QUERY_KEY = ["auth", "profile"] as const;

const hasStoredSession = () => Boolean(getAccessToken() || getRefreshToken());

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasSession, setHasSession] = useState(hasStoredSession);
  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: authService.getProfile,
    enabled: hasSession,
    staleTime: Infinity,
    retry: false,
  });
  const user = profileQuery.data ?? null;

  useEffect(() => {
    if (!profileQuery.isError) return;
    clearTokens();
    queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
    setHasSession(false);
  }, [profileQuery.isError, queryClient]);

  useEffect(() => {
    const handleExpiredSession = () => {
      clearTokens();
      queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
      setHasSession(false);
    };

    window.addEventListener("linkup:auth-expired", handleExpiredSession);
    return () =>
      window.removeEventListener("linkup:auth-expired", handleExpiredSession);
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: hasSession && profileQuery.isPending,
      isAuthenticated: user !== null,
      async login(credentials) {
        const authenticatedUser = await authService.login(credentials);
        queryClient.setQueryData<AuthUser>(
          PROFILE_QUERY_KEY,
          authenticatedUser,
        );
        setHasSession(true);
      },
      async register(payload, remember) {
        await authService.register(payload);
        const authenticatedUser = await authService.login({
          identifier: payload.username,
          password: payload.password,
          remember,
        });
        queryClient.setQueryData<AuthUser>(
          PROFILE_QUERY_KEY,
          authenticatedUser,
        );
        setHasSession(true);
      },
      async logout() {
        try {
          await authService.logout();
        } finally {
          queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
          setHasSession(false);
        }
      },
      async refreshProfile() {
        const refreshedUser = await queryClient.fetchQuery({
          queryKey: PROFILE_QUERY_KEY,
          queryFn: authService.getProfile,
          staleTime: 0,
        });
        queryClient.setQueryData<AuthUser>(PROFILE_QUERY_KEY, refreshedUser);
      },
      async updateProfile(payload) {
        const updatedUser = await authService.updateProfile(payload);
        queryClient.setQueryData<AuthUser>(PROFILE_QUERY_KEY, updatedUser);
      },
    }),
    [hasSession, profileQuery.isPending, queryClient, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
