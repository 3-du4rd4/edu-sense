import { api } from "@/services/api";
import {
  AuthResponse,
  AuthUser,
  LoginPayload,
  SignupPayload,
} from "@/types/auth";

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", payload);

  return response.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", payload);

  return response.data;
}

export async function getMe(): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/auth/me");

  return response.data;
}
