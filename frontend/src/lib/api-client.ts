import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const session = await authClient.getSession();
  const token = session?.data?.session?.token;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Logic for 401: redirect to login if we're on the client
      if (typeof window !== "undefined") {
        window.location.href = "/login?message=Session expired. Please log in again.";
      }
    }
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `API request failed: ${response.status} ${response.statusText}`;

    throw new Error(errorMessage);
  }

  return response.json();
}
