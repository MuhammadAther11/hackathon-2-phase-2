"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast-provider";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const isLogin = type === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error: authError } = await signIn.email({
          email,
          password,
        });
        if (authError) throw authError;
        router.push("/dashboard");
      } else {
        const { error: authError } = await signUp.email({
          email,
          password,
          name,
        });
        if (authError) throw authError;
        router.push("/login?message=Signup successful. Please log in.");
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || "An authentication error occurred";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isLogin ? "Please enter your details to sign in" : "Join us to start managing your tasks"}
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative text-sm text-center" role="alert">
          {message}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-100">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : (
              isLogin ? "Sign in" : "Sign up"
            )}
          </button>
        </div>
      </form>

      <div className="text-center mt-4 text-sm">
        <span className="text-gray-600">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
        </span>
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {isLogin ? "Create an account" : "Sign in instead"}
        </Link>
      </div>
    </div>
  );
}
