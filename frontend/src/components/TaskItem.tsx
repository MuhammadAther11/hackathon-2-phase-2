"use client";

import { FrontendTask } from "@/types";
import { CheckCircle2, Circle, Trash2, Clock } from "lucide-react";

interface TaskItemProps {
  task: FrontendTask;
  onToggle: (id: string) => void;  // Updated to only take id
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-indigo-200 transition-colors group">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <button
          onClick={() => onToggle(task.id)}  // Updated call
          className={`focus:outline-none transition-colors ${
            task.is_completed ? "text-green-500" : "text-gray-400 group-hover:text-indigo-500"
          }`}
        >
          {task.is_completed ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              task.is_completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
