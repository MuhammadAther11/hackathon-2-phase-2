"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { CheckCircle2, Zap, Shield, Smartphone } from "lucide-react";

export default function HomePage() {
  const { data: session, isLoading } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoading && session ? (
                <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                    Login
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Manage Your Tasks Effortlessly</h1>
            <p className="text-xl text-gray-600 mb-8">TaskFlow helps you organize, prioritize, and complete your tasks with ease. Stay focused on what matters most.</p>
            <div className="flex gap-4">
              {!isLoading && !session && (
                <>
                  <Link href="/signup" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                    Get Started Free
                  </Link>
                  <Link href="/login" className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold">
                    Sign In
                  </Link>
                </>
              )}
              {session && (
                <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                  Open Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Create and organize tasks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Track progress in real-time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Collaborate with team members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Never miss a deadline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <Zap className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick & Easy</h3>
            <p className="text-gray-600">Create tasks in seconds. Intuitive interface designed for productivity.</p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <Shield className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">Your data is encrypted and protected. Only you can access your tasks.</p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <Smartphone className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive</h3>
            <p className="text-gray-600">Works perfectly on desktop, tablet, and mobile devices.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20 py-12 bg-white rounded-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to boost your productivity?</h2>
          <p className="text-lg text-gray-600 mb-8">Start managing your tasks today. It's free and takes less than a minute.</p>
          {!isLoading && !session && (
            <Link href="/signup" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg inline-block">
              Create Free Account
            </Link>
          )}
          {session && (
            <Link href="/dashboard" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg inline-block">
              Go to Dashboard
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}