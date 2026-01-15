export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export type UserRole = "admin" | "researcher" | "analyst" | "viewer";
export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  institution?: string;
  department?: string;
  phone?: string;
  status?: UserStatus;
}

export interface UserUpdateMe {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  institution?: string | null;
  department?: string | null;
  phone?: string | null;
  password?: string | null;
}

export interface UserUpdateAdmin extends UserUpdateMe {
  role?: UserRole | null;
  status?: UserStatus | null;
}
