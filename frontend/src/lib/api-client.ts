import { authClient } from "./auth-client";
import { getNetworkErrorMessage } from "./auth-errors";

const API_URL = "https://atherali11-deploy-phase-2.hf.space";

// Custom error class that supports additional properties
class APIError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.detail = detail;
  }
}

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const session = authClient.getSession();
  const token = session?.data?.token;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Ensure trailing slash for GET requests without query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (!url.endsWith('/') && !endpoint.includes('?')) {
    url += '/';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      redirect: 'follow',
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Logic for 401: redirect to login if we're on the client
        if (typeof window !== "undefined") {
          window.location.href = "/login?message=Session expired. Please log in again.";
          // Also clear the session
          authClient.signOut();
        }
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as Record<string, unknown>)?.detail || `API request failed: ${response.status} ${response.statusText}`;

      throw new APIError(String(errorMessage), response.status, (errorData as Record<string, unknown>)?.detail);
    }

    // Handle 204 No Content responses (no body)
    if (response.status === 204) {
      return null as T;
    }

    // Handle empty responses
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return null as T;
    }

    const json = await response.json();
    return json as T;
  } catch (err: unknown) {
    // Handle network errors (no internet, timeouts, etc.)
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new APIError(getNetworkErrorMessage(err), 0);
    }

    // If it's already our error with status, re-throw it
    if (err instanceof APIError) {
      throw err;
    }

    // Generic error handling
    throw err;
  }
}
