import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  createCommentSchema,
} from "@/lib/validations";

describe("createProjectSchema", () => {
  it("validates a valid project", () => {
    const result = createProjectSchema.safeParse({
      name: "My Project",
      description: "A test project",
    });
    expect(result.success).toBe(true);
  });

  it("requires a name", () => {
    const result = createProjectSchema.safeParse({
      description: "A test project",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = createProjectSchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional description", () => {
    const result = createProjectSchema.safeParse({
      name: "My Project",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name over 100 characters", () => {
    const result = createProjectSchema.safeParse({
      name: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProjectSchema", () => {
  it("allows partial updates", () => {
    const result = updateProjectSchema.safeParse({
      name: "Updated Name",
    });
    expect(result.success).toBe(true);
  });

  it("allows empty object", () => {
    const result = updateProjectSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("createTaskSchema", () => {
  it("validates a valid task", () => {
    const result = createTaskSchema.safeParse({
      projectId: "clx1234567890abcdefghij",
      title: "My Task",
      description: "A test task",
      status: "todo",
      priority: "medium",
    });
    expect(result.success).toBe(true);
  });

  it("requires projectId", () => {
    const result = createTaskSchema.safeParse({
      title: "My Task",
    });
    expect(result.success).toBe(false);
  });

  it("requires title", () => {
    const result = createTaskSchema.safeParse({
      projectId: "clx1234567890abcdefghij",
    });
    expect(result.success).toBe(false);
  });

  it("validates status enum", () => {
    const result = createTaskSchema.safeParse({
      projectId: "clx1234567890abcdefghij",
      title: "My Task",
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("validates priority enum", () => {
    const result = createTaskSchema.safeParse({
      projectId: "clx1234567890abcdefghij",
      title: "My Task",
      priority: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("defaults status to todo", () => {
    const result = createTaskSchema.parse({
      projectId: "clx1234567890abcdefghij",
      title: "My Task",
    });
    expect(result.status).toBe("todo");
  });

  it("defaults priority to medium", () => {
    const result = createTaskSchema.parse({
      projectId: "clx1234567890abcdefghij",
      title: "My Task",
    });
    expect(result.priority).toBe("medium");
  });
});

describe("updateTaskSchema", () => {
  it("allows partial updates", () => {
    const result = updateTaskSchema.safeParse({
      title: "Updated Title",
    });
    expect(result.success).toBe(true);
  });

  it("does not include projectId", () => {
    const result = updateTaskSchema.safeParse({
      projectId: "clx1234567890abcdefghij",
    });
    // projectId should be stripped
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("projectId");
    }
  });
});

describe("createCommentSchema", () => {
  it("validates a valid comment", () => {
    const result = createCommentSchema.safeParse({
      taskId: "clx1234567890abcdefghij",
      content: "This is a comment",
    });
    expect(result.success).toBe(true);
  });

  it("requires taskId", () => {
    const result = createCommentSchema.safeParse({
      content: "This is a comment",
    });
    expect(result.success).toBe(false);
  });

  it("requires content", () => {
    const result = createCommentSchema.safeParse({
      taskId: "clx1234567890abcdefghij",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = createCommentSchema.safeParse({
      taskId: "clx1234567890abcdefghij",
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional parentId", () => {
    const result = createCommentSchema.safeParse({
      taskId: "clx1234567890abcdefghij",
      content: "This is a reply",
      parentId: "clx0987654321jihgfedcba",
    });
    expect(result.success).toBe(true);
  });
});
