import { TaskDashboard } from "@/components/TaskDashboard";
import { NavBar } from "@/components/NavBar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center px-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Dashboard</h1>
            <p className="mt-2 text-gray-600">Keep track of your projects and daily goals.</p>
          </header>
          <TaskDashboard />
        </div>
      </main>
    </div>
  );
}
