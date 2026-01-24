/**
 * Database Seed Script
 *
 * Seeds the database with sample data for development.
 * Run with: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Create users
  const alice = await prisma.user.upsert({
    where: { email: "alice@techflow.io" },
    update: {},
    create: {
      email: "alice@techflow.io",
      name: "Alice Chen",
      role: "admin",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@techflow.io" },
    update: {},
    create: {
      email: "bob@techflow.io",
      name: "Bob Martinez",
      role: "member",
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@techflow.io" },
    update: {},
    create: {
      email: "carol@techflow.io",
      name: "Carol Williams",
      role: "member",
    },
  });

  const dave = await prisma.user.upsert({
    where: { email: "dave@techflow.io" },
    update: {},
    create: {
      email: "dave@techflow.io",
      name: "Dave Okonkwo",
      role: "member",
    },
  });

  console.log(
    "✅ Created users:",
    [alice.name, bob.name, carol.name, dave.name].join(", ")
  );

  // Create labels
  const labels = await Promise.all([
    prisma.label.upsert({
      where: { id: "bug" },
      update: {},
      create: { id: "bug", name: "Bug", color: "#ef4444" },
    }),
    prisma.label.upsert({
      where: { id: "feature" },
      update: {},
      create: { id: "feature", name: "Feature", color: "#22c55e" },
    }),
    prisma.label.upsert({
      where: { id: "enhancement" },
      update: {},
      create: { id: "enhancement", name: "Enhancement", color: "#3b82f6" },
    }),
    prisma.label.upsert({
      where: { id: "docs" },
      update: {},
      create: { id: "docs", name: "Documentation", color: "#a855f7" },
    }),
    prisma.label.upsert({
      where: { id: "ux" },
      update: {},
      create: { id: "ux", name: "UX", color: "#f59e0b" },
    }),
    prisma.label.upsert({
      where: { id: "infra" },
      update: {},
      create: { id: "infra", name: "Infrastructure", color: "#6b7280" },
    }),
  ]);

  console.log("✅ Created labels:", labels.map((l) => l.name).join(", "));

  // Create a project
  const project = await prisma.project.upsert({
    where: { id: "flowboard-main" },
    update: {},
    create: {
      id: "flowboard-main",
      name: "FlowBoard Main",
      description: "The main FlowBoard project management application",
      status: "active",
      ownerId: alice.id,
    },
  });

  console.log("✅ Created project:", project.name);

  // Add project members
  for (const user of [bob, carol, dave]) {
    await prisma.projectMember.upsert({
      where: {
        projectId_userId: { projectId: project.id, userId: user.id },
      },
      update: {},
      create: { projectId: project.id, userId: user.id, role: "member" },
    });
  }

  console.log("✅ Added project members");

  // Create tasks — these tell a story about the project history
  const tasks = [
    {
      id: "task-1",
      title: "Set up project structure",
      description:
        "Initialize the Next.js project with TypeScript and Tailwind CSS",
      status: "done",
      priority: "high",
      assigneeId: alice.id,
    },
    {
      id: "task-2",
      title: "Implement user authentication",
      description:
        "Add login and registration functionality using NextAuth.js",
      status: "done",
      priority: "high",
      assigneeId: bob.id,
    },
    {
      id: "task-3",
      title: "Create project CRUD API",
      description:
        "Build API endpoints for creating, reading, updating, and deleting projects",
      status: "done",
      priority: "medium",
      assigneeId: carol.id,
    },
    {
      id: "task-4",
      title: "Create task CRUD API",
      description:
        "Build API endpoints for task management within projects",
      status: "done",
      priority: "medium",
      assigneeId: alice.id,
    },
    {
      id: "task-5",
      title: "Build project dashboard UI",
      description:
        "Create the main dashboard showing project overview and recent activity",
      status: "done",
      priority: "high",
      assigneeId: bob.id,
    },
    {
      id: "task-6",
      title: "Implement task board (Kanban)",
      description:
        "Create drag-and-drop Kanban board for task management",
      status: "in_progress",
      priority: "medium",
      assigneeId: carol.id,
    },
    {
      id: "task-7",
      title: "Add comment system",
      description:
        "Allow users to comment on tasks with threaded replies",
      status: "done",
      priority: "medium",
      assigneeId: dave.id,
    },
    // This is the key task — assigned to Bob 3 days ago, but he didn't
    // know about it until standup because there are no notifications.
    // This is the problem the candidate needs to solve.
    {
      id: "task-8",
      title: "Fix notification delivery for task assignments",
      description:
        "Users aren't getting notified when assigned to tasks. The bell icon is a placeholder. See incident INC-042 and GitHub issue #7.",
      status: "todo",
      priority: "urgent",
      assigneeId: null,
    },
    {
      id: "task-9",
      title: "Add email digest for weekly activity summary",
      description:
        "Send weekly email to users summarizing their assigned tasks and project activity",
      status: "todo",
      priority: "low",
      assigneeId: null,
    },
    {
      id: "task-10",
      title: "Migrate to edge-compatible database driver",
      description:
        "Investigate switching from node-postgres to @neondatabase/serverless for Edge Runtime compatibility",
      status: "todo",
      priority: "medium",
      assigneeId: null,
    },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {},
      create: {
        ...task,
        projectId: project.id,
        creatorId: alice.id,
      },
    });
  }

  console.log("✅ Created tasks:", tasks.length);

  // Add task labels
  await prisma.taskLabel.upsert({
    where: { taskId_labelId: { taskId: "task-8", labelId: "bug" } },
    update: {},
    create: { taskId: "task-8", labelId: "bug" },
  });
  await prisma.taskLabel.upsert({
    where: { taskId_labelId: { taskId: "task-8", labelId: "ux" } },
    update: {},
    create: { taskId: "task-8", labelId: "ux" },
  });
  await prisma.taskLabel.upsert({
    where: { taskId_labelId: { taskId: "task-10", labelId: "infra" } },
    update: {},
    create: { taskId: "task-10", labelId: "infra" },
  });

  console.log("✅ Added task labels");

  // Create activity history — tells the story of missed assignments
  const now = new Date();
  const daysAgo = (d: number) =>
    new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const activities = [
    {
      type: "project_created",
      projectId: project.id,
      userId: alice.id,
      metadata: { projectName: project.name },
      createdAt: daysAgo(30),
    },
    {
      type: "task_created",
      projectId: project.id,
      taskId: "task-8",
      userId: alice.id,
      metadata: { taskTitle: "Fix notification delivery for task assignments" },
      createdAt: daysAgo(10),
    },
    // Bob was assigned task-5, but nobody told him for 2 days
    {
      type: "task_assigned",
      projectId: project.id,
      taskId: "task-5",
      userId: bob.id,
      metadata: {
        taskTitle: "Build project dashboard UI",
        assignedBy: alice.id,
      },
      createdAt: daysAgo(14),
    },
    // Dave was assigned task-7 and didn't notice for a day
    {
      type: "task_assigned",
      projectId: project.id,
      taskId: "task-7",
      userId: dave.id,
      metadata: { taskTitle: "Add comment system", assignedBy: alice.id },
      createdAt: daysAgo(8),
    },
    {
      type: "task_completed",
      projectId: project.id,
      taskId: "task-7",
      userId: dave.id,
      metadata: { taskTitle: "Add comment system" },
      createdAt: daysAgo(5),
    },
    // Carol was assigned the kanban task
    {
      type: "task_assigned",
      projectId: project.id,
      taskId: "task-6",
      userId: carol.id,
      metadata: {
        taskTitle: "Implement task board (Kanban)",
        assignedBy: alice.id,
      },
      createdAt: daysAgo(6),
    },
  ];

  for (const activity of activities) {
    await prisma.activity.create({ data: activity });
  }

  console.log("✅ Created activity log entries");

  // Add a comment on task-8 from the product manager expressing urgency
  await prisma.comment.create({
    data: {
      taskId: "task-8",
      authorId: alice.id,
      content:
        "This is becoming a real pain point. Two PMs have escalated — people are missing assignments and it's affecting sprint velocity. We had a client deadline slip last week because the assignee didn't even know they had the task until standup 3 days later. We need to prioritize this.",
    },
  });

  await prisma.comment.create({
    data: {
      taskId: "task-8",
      authorId: bob.id,
      content:
        "Marcus started on this in Sprint 14 but got pulled to payments. His stub code is in src/lib/notifications.ts. He had issues with SSE on Vercel — the serverless timeout killed the connection. Might need to look at Edge Runtime or just do polling.",
    },
  });

  await prisma.comment.create({
    data: {
      taskId: "task-8",
      authorId: dave.id,
      content:
        "Can confirm — I was assigned the comment system task and had no idea for a full day. Only found out when Carol mentioned it in standup. The activity feed shows assignments but who checks that proactively?",
    },
  });

  console.log("✅ Created comments on notification task");

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
