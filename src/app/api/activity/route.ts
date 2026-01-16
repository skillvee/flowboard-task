import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/activity
 * Fetch activity feed (with optional filters)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (taskId) where.taskId = taskId;
    if (userId) where.userId = userId;

    const [activities, total] = await Promise.all([
      db.activity.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
          project: {
            select: { id: true, name: true },
          },
          task: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.activity.count({ where }),
    ]);

    return NextResponse.json({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
