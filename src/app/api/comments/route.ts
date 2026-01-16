import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCommentSchema } from "@/lib/validations";

/**
 * GET /api/comments
 * Fetch comments for a task
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    const comments = await db.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Filter to only top-level comments (threaded structure)
    const topLevelComments = comments.filter((c) => !c.parentId);

    return NextResponse.json(topLevelComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Create a new comment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    // TODO: Get actual user from session
    const userId = "temp-user-id";

    // Get the task to find the project
    const task = await db.task.findUnique({
      where: { id: validated.taskId },
      select: { projectId: true, title: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const comment = await db.comment.create({
      data: {
        ...validated,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // Create activity log
    await db.activity.create({
      data: {
        type: "comment_added",
        projectId: task.projectId,
        taskId: validated.taskId,
        userId,
        metadata: { taskTitle: task.title },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
