"use client";

import { useState } from "react";

import { getMe, login, signup } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { LoginPayload, SignupPayload } from "@/types/auth";

export function useAuth() {
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } =
    useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(payload: SignupPayload) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await signup(payload);

      setAuth(response.user, response.accessToken);

      return response;
    } catch {
      setError("Erro ao criar conta.");
      throw new Error("Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(payload: LoginPayload) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await login(payload);

      setAuth(response.user, response.accessToken);

      return response;
    } catch {
      setError("Email ou senha inválidos.");
      throw new Error("Email ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMe() {
    if (!accessToken) return null;

    try {
      setIsLoading(true);
      setError(null);

      const user = await getMe();

      setAuth(user, accessToken);

      return user;
    } catch {
      clearAuth();
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    clearAuth();
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    signup: handleSignup,
    login: handleLogin,
    loadMe,
    logout,
  };
}
