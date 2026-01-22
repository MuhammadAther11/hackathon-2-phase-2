"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskItem } from "./TaskItem";
import { Plus, Loader2, ListChecks } from "lucide-react";

export function TaskDashboard() {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTask } = useTasks();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createTask.mutateAsync({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
    });
    setNewTitle("");
    setNewDescription("");
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
      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title
          </label>
          <input
            type="text"
            placeholder="Enter task title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={createTask.isPending}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Description (Optional)
          </label>
          <textarea
            placeholder="Enter task description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            rows={3}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={createTask.isPending}
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          disabled={createTask.isPending || !newTitle.trim()}
        >
          {createTask.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add Task
            </>
          )}
        </button>
      </form>

      <div className="space-y-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(id) => toggleTask.mutate(id)}
              onDelete={(id) => deleteTask.mutate(id)}
              onUpdate={(id, title, description) => updateTask.mutate({ id, title, description })}
              isUpdating={updateTask.isPending}
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

