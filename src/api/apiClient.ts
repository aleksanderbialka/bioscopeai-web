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

function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

function setRefreshToken(token: string): void {
  localStorage.setItem("refresh_token", token);
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

async function refreshAuthToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  setAuthToken(data.access_token);
  if (data.refresh_token) {
    setRefreshToken(data.refresh_token);
  }
  return data.access_token;
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
        // Token expired - try to refresh it
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            const newToken = await refreshAuthToken();
            isRefreshing = false;
            processQueue(null, newToken);
            
            // Retry original request with new token
            headers["Authorization"] = `Bearer ${newToken}`;
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...fetchOptions,
              headers,
            });
            
            if (retryResponse.ok) {
              if (retryResponse.status === 204 || retryResponse.headers.get("Content-Length") === "0") {
                return null as T;
              }
              
              const contentType = retryResponse.headers.get("Content-Type");
              if (contentType && contentType.includes("application/json")) {
                return await retryResponse.json();
              }
              
              return await retryResponse.text() as T;
            }
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError as Error, null);
            
            // Refresh failed - logout user
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            throw new ApiException(401, "Session expired - please login again");
          }
        }
        
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: async (token: string) => {
              headers["Authorization"] = `Bearer ${token}`;
              try {
                const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                  ...fetchOptions,
                  headers,
                });
                
                if (retryResponse.ok) {
                  if (retryResponse.status === 204 || retryResponse.headers.get("Content-Length") === "0") {
                    resolve(null as T);
                  } else {
                    const contentType = retryResponse.headers.get("Content-Type");
                    if (contentType && contentType.includes("application/json")) {
                      resolve(await retryResponse.json());
                    } else {
                      resolve(await retryResponse.text() as T);
                    }
                  }
                } else {
                  reject(new ApiException(retryResponse.status, "Request failed after token refresh"));
                }
              } catch (error) {
                reject(error);
              }
            },
            reject,
          });
        });
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
