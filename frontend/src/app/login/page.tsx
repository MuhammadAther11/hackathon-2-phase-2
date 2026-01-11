import { AuthForm } from "@/components/AuthForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <AuthForm type="login" />
        </Suspense>
      </div>
    </main>
  );
}
