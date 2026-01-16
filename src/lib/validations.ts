import { z } from "zod";

/**
 * Project validation schemas
 */
export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/**
 * Task validation schemas
 */
export const createTaskSchema = z.object({
  projectId: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().cuid().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * Comment validation schemas
 */
export const createCommentSchema = z.object({
  taskId: z.string().cuid(),
  content: z.string().min(1, "Content is required").max(5000),
  parentId: z.string().cuid().optional().nullable(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/**
 * User validation schemas
 */
export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
