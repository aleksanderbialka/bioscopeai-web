const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

interface ApiError {
  message: string;
  status: number;
  detail?: string;
}

class ApiException extends Error {
  status: number;
  detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.detail = detail;
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        throw new ApiException(401, "Unauthorized - please login");
      }

      let errorDetail: string | undefined;
      try {
        const errorData: ApiError = await response.json();
        errorDetail = errorData.detail || errorData.message;
      } catch {
        errorDetail = response.statusText;
      }

      throw new ApiException(
        response.status,
        `API Error: ${response.statusText}`,
        errorDetail
      );
    }

    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return null as T;
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return response.text() as T;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new ApiException(0, "Network error - please check your connection");
    }
    throw error;
  }
}

export { API_BASE_URL };
