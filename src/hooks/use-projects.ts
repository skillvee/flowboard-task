"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project } from "@/types";

interface UseProjectsOptions {
  status?: string;
}

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createProject: (data: CreateProjectData) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

interface CreateProjectData {
  name: string;
  description?: string;
  dueDate?: string;
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: string;
  dueDate?: string;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.set("status", options.status);

      const response = await fetch(`/api/projects?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [options.status]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: CreateProjectData): Promise<Project> => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    const project = await response.json();
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const updateProject = async (
    id: string,
    data: UpdateProjectData
  ): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }

    const updatedProject = await response.json();
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? updatedProject : p))
    );
    return updatedProject;
  };

  const deleteProject = async (id: string): Promise<void> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete project");
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
