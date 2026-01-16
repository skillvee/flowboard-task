import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/projects/route";
import { db } from "@/lib/db";

// Mock the database
vi.mock("@/lib/db", () => ({
  db: {
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
  },
}));

describe("GET /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns projects with pagination", async () => {
    const mockProjects = [
      {
        id: "1",
        name: "Project 1",
        owner: { id: "user1", name: "User 1", avatarUrl: null },
        _count: { tasks: 5, members: 2 },
      },
    ];

    vi.mocked(db.project.findMany).mockResolvedValue(mockProjects as never);
    vi.mocked(db.project.count).mockResolvedValue(1);

    const request = new NextRequest("http://localhost/api/projects");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockProjects);
    expect(data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it("filters by status when provided", async () => {
    vi.mocked(db.project.findMany).mockResolvedValue([]);
    vi.mocked(db.project.count).mockResolvedValue(0);

    const request = new NextRequest("http://localhost/api/projects?status=active");
    await GET(request);

    expect(db.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "active" },
      })
    );
  });

  it("handles custom pagination parameters", async () => {
    vi.mocked(db.project.findMany).mockResolvedValue([]);
    vi.mocked(db.project.count).mockResolvedValue(100);

    const request = new NextRequest("http://localhost/api/projects?page=3&limit=10");
    const response = await GET(request);
    const data = await response.json();

    expect(db.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 10,
      })
    );
    expect(data.pagination.page).toBe(3);
    expect(data.pagination.limit).toBe(10);
  });
});

describe("POST /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a project with valid data", async () => {
    const mockProject = {
      id: "new-project",
      name: "New Project",
      description: "Test description",
      ownerId: "temp-user-id",
      owner: { id: "temp-user-id", name: "User", avatarUrl: null },
    };

    vi.mocked(db.project.create).mockResolvedValue(mockProject as never);
    vi.mocked(db.activity.create).mockResolvedValue({} as never);

    const request = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "New Project",
        description: "Test description",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe("New Project");
    expect(db.activity.create).toHaveBeenCalled();
  });

  it("returns error for invalid data", async () => {
    const request = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        // Missing required name field
        description: "Test description",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});
