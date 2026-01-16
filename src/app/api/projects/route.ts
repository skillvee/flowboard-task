import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createProjectSchema } from "@/lib/validations";

/**
 * GET /api/projects
 * Fetch all projects (with optional pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, avatarUrl: true },
          },
          _count: {
            select: { tasks: true, members: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createProjectSchema.parse(body);

    // TODO: Get actual user from session
    const userId = "temp-user-id";

    const project = await db.project.create({
      data: {
        ...validated,
        ownerId: userId,
      },
      include: {
        owner: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // Create activity log
    await db.activity.create({
      data: {
        type: "project_created",
        projectId: project.id,
        userId,
        metadata: { projectName: project.name },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
