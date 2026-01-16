"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface ProjectFormProps {
  initialData?: {
    name: string;
    description: string;
    dueDate: string;
  };
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

interface ProjectFormData {
  name: string;
  description: string;
  dueDate: string;
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        dueDate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Project Name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter project name"
        required
      />

      <Textarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter project description (optional)"
        rows={4}
      />

      <Input
        label="Due Date"
        id="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
