import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { TaskCard } from "@/components/task-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      owner: true,
      members: {
        include: { user: true },
      },
      tasks: {
        include: {
          assignee: true,
        },
        orderBy: [{ status: "asc" }, { position: "asc" }],
      },
    },
  });

  if (!project) {
    notFound();
  }

  const tasksByStatus = {
    todo: project.tasks.filter((t) => t.status === "todo"),
    in_progress: project.tasks.filter((t) => t.status === "in_progress"),
    review: project.tasks.filter((t) => t.status === "review"),
    done: project.tasks.filter((t) => t.status === "done"),
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <Badge
                  variant={project.status === "active" ? "success" : "default"}
                >
                  {project.status}
                </Badge>
              </div>
              {project.description && (
                <p className="text-gray-600 max-w-2xl">{project.description}</p>
              )}
            </div>
            <Link href={`/projects/${id}/settings`}>
              <Button variant="secondary">Settings</Button>
            </Link>
          </div>

          {/* Project Meta */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Avatar name={project.owner.name} size="xs" />
              <span>Owner: {project.owner.name}</span>
            </div>
            {project.dueDate && (
              <span>Due: {formatDate(project.dueDate)}</span>
            )}
            <span>{project.tasks.length} tasks</span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* To Do */}
          <TaskColumn title="To Do" tasks={tasksByStatus.todo} />

          {/* In Progress */}
          <TaskColumn title="In Progress" tasks={tasksByStatus.in_progress} />

          {/* Review */}
          <TaskColumn title="Review" tasks={tasksByStatus.review} />

          {/* Done */}
          <TaskColumn title="Done" tasks={tasksByStatus.done} />
        </div>
      </main>
    </>
  );
}

interface TaskColumnProps {
  title: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    assignee: { name: string; avatarUrl: string | null } | null;
  }>;
}

function TaskColumn({ title, tasks }: TaskColumnProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
        )}
      </div>
    </div>
  );
}
