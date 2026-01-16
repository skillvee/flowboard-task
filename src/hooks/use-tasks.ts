"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task } from "@/types";

interface UseTasksOptions {
  projectId?: string;
  status?: string;
  assigneeId?: string;
}

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

interface CreateTaskData {
  projectId: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string | null;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string | null;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.projectId) params.set("projectId", options.projectId);
      if (options.status) params.set("status", options.status);
      if (options.assigneeId) params.set("assigneeId", options.assigneeId);

      const response = await fetch(`/api/tasks?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [options.projectId, options.status, options.assigneeId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: CreateTaskData): Promise<Task> => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const task = await response.json();
    setTasks((prev) => [...prev, task]);
    return task;
  };

  const updateTask = async (
    id: string,
    data: UpdateTaskData
  ): Promise<Task> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    const updatedTask = await response.json();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? updatedTask : t))
    );
    return updatedTask;
  };

  const deleteTask = async (id: string): Promise<void> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
