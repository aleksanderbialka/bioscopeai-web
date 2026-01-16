import type { LoginCredentials, RegisterCredentials, TokenResponse, User, UserUpdateMe, UserUpdateAdmin } from "../types/auth.types";
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

export async function getAllUsers(): Promise<User[]> {
  return apiRequest<User[]>("/api/users/users", {
    method: "GET",
  });
}

export async function getUserById(userId: string): Promise<User> {
  return apiRequest<User>(`/api/users/users/${userId}`, {
    method: "GET",
  });
}

export async function updateUser(userId: string, data: UserUpdateMe | UserUpdateAdmin): Promise<User> {
  return apiRequest<User>(`/api/users/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: string): Promise<void> {
  return apiRequest<void>(`/api/users/users/${userId}`, {
    method: "DELETE",
  });
}
