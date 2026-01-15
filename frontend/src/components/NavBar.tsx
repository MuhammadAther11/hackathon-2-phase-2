"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, CheckSquare, User } from "lucide-react";
import Link from "next/link";

export function NavBar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <CheckSquare className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
            {!isPending && session && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/feed"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Feed
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isPending && session ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{session.user.name || session.user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-150 ease-in-out"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign out</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
