import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTaskSchema } from "@/lib/validations";

/**
 * GET /api/tasks
 * Fetch tasks (with optional filters)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const assigneeId = searchParams.get("assigneeId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;

    const [tasks, total] = await Promise.all([
      db.task.findMany({
        where,
        include: {
          assignee: {
            select: { id: true, name: true, avatarUrl: true },
          },
          creator: {
            select: { id: true, name: true, avatarUrl: true },
          },
          labels: {
            include: { label: true },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: [{ status: "asc" }, { position: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.task.count({ where }),
    ]);

    return NextResponse.json({
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createTaskSchema.parse(body);

    // TODO: Get actual user from session
    const userId = "temp-user-id";

    const task = await db.task.create({
      data: {
        ...validated,
        creatorId: userId,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // Create activity log
    await db.activity.create({
      data: {
        type: "task_created",
        projectId: task.projectId,
        taskId: task.id,
        userId,
        metadata: { taskTitle: task.title },
      },
    });

    // If task is assigned, create assignment activity
    if (task.assigneeId) {
      await db.activity.create({
        data: {
          type: "task_assigned",
          projectId: task.projectId,
          taskId: task.id,
          userId: task.assigneeId,
          metadata: { taskTitle: task.title, assignedBy: userId },
        },
      });
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
