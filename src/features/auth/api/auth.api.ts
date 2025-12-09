import type { LoginCredentials, RegisterCredentials, TokenResponse, User } from "../types/auth.types";
import { apiRequest } from "../../../api/apiClient";

export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    requiresAuth: false,
  });
}

export async function register(credentials: RegisterCredentials): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
    requiresAuth: false,
  });
}

export async function refreshToken(): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/api/auth/refresh", {
    method: "POST",
  });
}

export async function logout(): Promise<void> {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/api/users/me", {
    method: "GET",
  });
}
