/**
 * Common types used across the application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: "admin" | "member";
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "archived" | "completed";
  dueDate: Date | null;
  ownerId: string;
  owner?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  assigneeId: string | null;
  creatorId: string;
  position: number;
  assignee?: User | null;
  creator?: User;
  project?: Project;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  parentId: string | null;
  author?: User;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  projectId: string | null;
  taskId: string | null;
  userId: string;
  metadata: Record<string, unknown> | null;
  user?: User;
  project?: Project | null;
  task?: Task | null;
  createdAt: Date;
}

export type ActivityType =
  | "project_created"
  | "project_updated"
  | "task_created"
  | "task_updated"
  | "task_assigned"
  | "task_completed"
  | "comment_added"
  | "member_added"
  | "member_removed";

/**
 * API response types
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
