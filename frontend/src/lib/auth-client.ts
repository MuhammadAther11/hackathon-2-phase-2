"use client";

import { useState, useEffect } from "react";

// Define types for our auth responses
interface User {
  id: string;
  email: string;
  created_at: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
  token_type: string;
}

interface SignupResponse {
  id: string;
  email: string;
  created_at: string;
}

interface Session {
  user: User;
  token: string;
}

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Auth client implementation
class AuthClient {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken && savedUser) {
        this.token = savedToken;
        this.user = JSON.parse(savedUser);
      }
    }
  }

  // Save session to localStorage and cookie
  private saveSession(token: string, user: User) {
    this.token = token;
    this.user = user;

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      // Also set as cookie for server-side middleware
      document.cookie = `auth_token=${token}; path=/; max-age=86400`;
    }
  }

  // Clear session
  private clearSession() {
    this.token = null;
    this.user = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      // Also clear the cookie
      document.cookie = "auth_token=; path=/; max-age=0";
    }
  }

  // Signup
  async signUp(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Signup failed: ${response.status}`);
      }

      const data: SignupResponse = await response.json();
      return { user: data, error: null };
    } catch (error: any) {
      return { user: null, error: { message: error.message } };
    }
  }

  // Login
  async signIn(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Login failed: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      // Save session
      this.saveSession(data.access_token, data.user);

      return { session: { user: data.user, token: data.access_token }, error: null };
    } catch (error: any) {
      return { session: null, error: { message: error.message } };
    }
  }

  // Logout
  async signOut() {
    try {
      // Clear session
      this.clearSession();

      // Make logout API call (optional, for server-side cleanup)
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }).catch(() => {}); // Ignore logout API errors

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }

  // Get current session
  getSession() {
    if (this.token && this.user) {
      return { data: { user: this.user, token: this.token }, error: null };
    }
    return { data: null, error: null };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }
}

// Create singleton instance
export const authClient = new AuthClient();

// Export convenience functions
export const signUp = {
  email: (credentials: { email: string; password: string }) => authClient.signUp(credentials)
};

export const signIn = {
  email: (credentials: { email: string; password: string }) => authClient.signIn(credentials)
};

export const signOut = () => authClient.signOut();

// Custom hook for session
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      const sess = authClient.getSession();
      setSession(sess.data as Session);
      setLoading(false);
    };

    checkSession();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      checkSession();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { data: session, isLoading: loading };
}
