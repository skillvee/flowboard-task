"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";

interface TaskFormProps {
  projectId: string;
  initialData?: {
    title: string;
    description: string;
    status: string;
    priority: string;
    assigneeId: string | null;
  };
  users?: Array<{ id: string; name: string }>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeId: string | null;
}

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export function TaskForm({
  initialData,
  users = [],
  onSubmit,
  onCancel,
  isEditing = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "todo");
  const [priority, setPriority] = useState(initialData?.priority || "medium");
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const assigneeOptions = [
    { value: "", label: "Unassigned" },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        required
      />

      <Textarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description (optional)"
        rows={4}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUS_OPTIONS}
        />

        <Select
          label="Priority"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={PRIORITY_OPTIONS}
        />
      </div>

      <Select
        label="Assignee"
        id="assignee"
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
        options={assigneeOptions}
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
            ? "Update Task"
            : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
