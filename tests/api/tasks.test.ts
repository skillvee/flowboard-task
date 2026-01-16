import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/tasks/route";
import { db } from "@/lib/db";

// Mock the database
vi.mock("@/lib/db", () => ({
  db: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
  },
}));

describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns tasks with pagination", async () => {
    const mockTasks = [
      {
        id: "1",
        title: "Task 1",
        status: "todo",
        priority: "medium",
        assignee: null,
        creator: { id: "user1", name: "User 1", avatarUrl: null },
        labels: [],
        _count: { comments: 0 },
      },
    ];

    vi.mocked(db.task.findMany).mockResolvedValue(mockTasks as never);
    vi.mocked(db.task.count).mockResolvedValue(1);

    const request = new NextRequest("http://localhost/api/tasks");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockTasks);
    expect(data.pagination.total).toBe(1);
  });

  it("filters by projectId", async () => {
    vi.mocked(db.task.findMany).mockResolvedValue([]);
    vi.mocked(db.task.count).mockResolvedValue(0);

    const request = new NextRequest("http://localhost/api/tasks?projectId=proj-123");
    await GET(request);

    expect(db.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ projectId: "proj-123" }),
      })
    );
  });

  it("filters by status", async () => {
    vi.mocked(db.task.findMany).mockResolvedValue([]);
    vi.mocked(db.task.count).mockResolvedValue(0);

    const request = new NextRequest("http://localhost/api/tasks?status=in_progress");
    await GET(request);

    expect(db.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "in_progress" }),
      })
    );
  });

  it("filters by assigneeId", async () => {
    vi.mocked(db.task.findMany).mockResolvedValue([]);
    vi.mocked(db.task.count).mockResolvedValue(0);

    const request = new NextRequest("http://localhost/api/tasks?assigneeId=user-123");
    await GET(request);

    expect(db.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ assigneeId: "user-123" }),
      })
    );
  });
});

describe("POST /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a task with valid data", async () => {
    const mockTask = {
      id: "new-task",
      projectId: "proj-123",
      title: "New Task",
      status: "todo",
      priority: "high",
      creatorId: "temp-user-id",
      assigneeId: null,
      assignee: null,
      creator: { id: "temp-user-id", name: "User", avatarUrl: null },
    };

    vi.mocked(db.task.create).mockResolvedValue(mockTask as never);
    vi.mocked(db.activity.create).mockResolvedValue({} as never);

    const request = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        projectId: "clx1234567890abcdefghij",
        title: "New Task",
        priority: "high",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe("New Task");
  });

  it("creates activity when task is assigned", async () => {
    const mockTask = {
      id: "new-task",
      projectId: "proj-123",
      title: "New Task",
      status: "todo",
      priority: "medium",
      creatorId: "temp-user-id",
      assigneeId: "assignee-123",
      assignee: { id: "assignee-123", name: "Assignee", avatarUrl: null },
      creator: { id: "temp-user-id", name: "User", avatarUrl: null },
    };

    vi.mocked(db.task.create).mockResolvedValue(mockTask as never);
    vi.mocked(db.activity.create).mockResolvedValue({} as never);

    const request = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        projectId: "clx1234567890abcdefghij",
        title: "New Task",
        assigneeId: "clx0987654321jihgfedcba",
      }),
    });

    await POST(request);

    // Should create both task_created and task_assigned activities
    expect(db.activity.create).toHaveBeenCalledTimes(2);
  });

  it("returns error for missing required fields", async () => {
    const request = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        // Missing projectId and title
        description: "Some description",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});
