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

  console.log("✅ Created users:", [alice.name, bob.name, carol.name].join(", "));

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
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: bob.id } },
    update: {},
    create: { projectId: project.id, userId: bob.id, role: "member" },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: carol.id } },
    update: {},
    create: { projectId: project.id, userId: carol.id, role: "member" },
  });

  console.log("✅ Added project members");

  // Create tasks
  const tasks = [
    {
      id: "task-1",
      title: "Set up project structure",
      description: "Initialize the Next.js project with TypeScript and Tailwind CSS",
      status: "done",
      priority: "high",
      assigneeId: alice.id,
    },
    {
      id: "task-2",
      title: "Implement user authentication",
      description: "Add login and registration functionality using NextAuth.js",
      status: "done",
      priority: "high",
      assigneeId: bob.id,
    },
    {
      id: "task-3",
      title: "Create project CRUD API",
      description: "Build API endpoints for creating, reading, updating, and deleting projects",
      status: "done",
      priority: "medium",
      assigneeId: carol.id,
    },
    {
      id: "task-4",
      title: "Create task CRUD API",
      description: "Build API endpoints for task management within projects",
      status: "done",
      priority: "medium",
      assigneeId: alice.id,
    },
    {
      id: "task-5",
      title: "Build project dashboard UI",
      description: "Create the main dashboard showing project overview and recent activity",
      status: "in_progress",
      priority: "high",
      assigneeId: bob.id,
    },
    {
      id: "task-6",
      title: "Implement task board (Kanban)",
      description: "Create drag-and-drop Kanban board for task management",
      status: "in_progress",
      priority: "medium",
      assigneeId: carol.id,
    },
    {
      id: "task-7",
      title: "Add comment system",
      description: "Allow users to comment on tasks with threaded replies",
      status: "todo",
      priority: "medium",
      assigneeId: null,
    },
    {
      id: "task-8",
      title: "Implement real-time notifications",
      description: "Add notification system for task assignments and updates",
      status: "todo",
      priority: "high",
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

  // Create some activities
  await prisma.activity.create({
    data: {
      type: "project_created",
      projectId: project.id,
      userId: alice.id,
      metadata: { projectName: project.name },
    },
  });

  console.log("✅ Created activity log entries");

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
