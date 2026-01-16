import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateTaskSchema } from "@/lib/validations";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/:id
 * Fetch a single task by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const task = await db.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        labels: {
          include: { label: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tasks/:id
 * Update a task
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateTaskSchema.parse(body);

    // Get existing task to check for assignment changes
    const existingTask = await db.task.findUnique({
      where: { id },
      select: { assigneeId: true, projectId: true, title: true },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = await db.task.update({
      where: { id },
      data: validated,
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // TODO: Get actual user from session
    const userId = "temp-user-id";

    // If assignee changed, create activity
    if (
      validated.assigneeId !== undefined &&
      validated.assigneeId !== existingTask.assigneeId
    ) {
      await db.activity.create({
        data: {
          type: "task_assigned",
          projectId: existingTask.projectId,
          taskId: id,
          userId: validated.assigneeId || userId,
          metadata: {
            taskTitle: existingTask.title,
            assignedBy: userId,
          },
        },
      });
    }

    // If status changed to done, create completion activity
    if (validated.status === "done" && task.status === "done") {
      await db.activity.create({
        data: {
          type: "task_completed",
          projectId: existingTask.projectId,
          taskId: id,
          userId,
          metadata: { taskTitle: existingTask.title },
        },
      });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    await db.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
