"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskItem } from "./TaskItem";
import { Plus, Loader2, ListChecks } from "lucide-react";

export function TaskDashboard() {
  const [newTitle, setNewTitle] = useState("");
  const { tasks, isLoading, createTask, deleteTask, toggleTask } = useTasks();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createTask.mutateAsync(newTitle);
    setNewTitle("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4 sm:px-0">
      <form onSubmit={handleCreate} className="relative group">
        <input
          type="text"
          placeholder="What needs to be done?"
          className="w-full pl-4 pr-12 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={createTask.isPending}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          disabled={createTask.isPending || !newTitle.trim()}
        >
          {createTask.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </form>

      <div className="space-y-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(id) => toggleTask.mutate(id)}  // Updated to use toggleTask
              onDelete={(id) => deleteTask.mutate(id)}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-100">
            <ListChecks className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-gray-500">Add a task above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

