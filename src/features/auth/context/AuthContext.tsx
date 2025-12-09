import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { AuthContext } from "./authContext.definition";
import type { AuthContextType } from "./authContext.definition";
import * as authApi from "../api/auth.api";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    localStorage.setItem("auth_token", response.access_token);
    
    const userData = await authApi.getCurrentUser();
    setUser(userData);
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    await authApi.register(credentials);
    // Automatically log in after registration
    await handleLogin({
      email: credentials.email,
      password: credentials.password,
    });
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
