"use client";

import { useState } from "react";
import { FrontendTask } from "@/types";
import { CheckCircle2, Circle, Trash2, Clock, Edit2, Save, X } from "lucide-react";

interface TaskItemProps {
  task: FrontendTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description?: string) => void;
  isUpdating?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onUpdate, isUpdating = false }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, editTitle.trim(), editDescription.trim() || undefined);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg border border-indigo-200 shadow-sm p-4 space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Task title"
          disabled={isUpdating}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          placeholder="Task description (optional)"
          rows={2}
          disabled={isUpdating}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating || !editTitle.trim()}
            className="px-3 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-indigo-200 transition-colors group">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <button
          onClick={() => onToggle(task.id)}
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
          {task.description && (
            <p className={`text-xs truncate ${task.is_completed ? "text-gray-400" : "text-gray-500"}`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
          title="Edit task"
        >
          <Edit2 className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
