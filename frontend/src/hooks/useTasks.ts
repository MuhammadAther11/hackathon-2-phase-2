"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { FrontendTask } from "@/types";
import { useToast } from "@/components/ui/toast-provider";

export function useTasks() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: tasks = [], isLoading, error } = useQuery<FrontendTask[]>({
    queryKey: ["tasks"],
    queryFn: () => apiFetch<FrontendTask[]>("/tasks"),
    onError: (err) => {
      showToast(`Failed to load tasks: ${err.message}`, "error");
    }
  });

  const createTask = useMutation({
    mutationFn: (title: string) =>
      apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      showToast(`Failed to create task: ${err.message}`, "error");
    }
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...updates }: Partial<FrontendTask> & { id: string }) =>
      apiFetch(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      showToast(`Failed to update task: ${err.message}`, "error");
    }
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/tasks/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      showToast(`Failed to delete task: ${err.message}`, "error");
    }
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
