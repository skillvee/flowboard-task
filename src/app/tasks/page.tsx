import { Header } from "@/components/header";
import { TaskCard } from "@/components/task-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";

export default async function MyTasksPage() {
  // TODO: Filter by current user
  const tasks = await db.task.findMany({
    where: {
      assigneeId: { not: null },
    },
    include: {
      project: {
        select: { id: true, name: true },
      },
      assignee: true,
    },
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
    ],
    take: 50,
  });

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    review: tasks.filter((t) => t.status === "review"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-2 text-gray-600">
            Tasks assigned to you across all projects
          </p>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-8">
            {/* In Progress */}
            {tasksByStatus.in_progress.length > 0 && (
              <TaskSection
                title="In Progress"
                badge="info"
                tasks={tasksByStatus.in_progress}
              />
            )}

            {/* To Do */}
            {tasksByStatus.todo.length > 0 && (
              <TaskSection
                title="To Do"
                badge="default"
                tasks={tasksByStatus.todo}
              />
            )}

            {/* Review */}
            {tasksByStatus.review.length > 0 && (
              <TaskSection
                title="In Review"
                badge="warning"
                tasks={tasksByStatus.review}
              />
            )}

            {/* Done */}
            {tasksByStatus.done.length > 0 && (
              <TaskSection
                title="Completed"
                badge="success"
                tasks={tasksByStatus.done}
              />
            )}
          </div>
        ) : (
          <EmptyState
            title="No tasks assigned"
            description="You don't have any tasks assigned to you yet"
          />
        )}
      </main>
    </>
  );
}

interface TaskSectionProps {
  title: string;
  badge: "default" | "success" | "warning" | "info";
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    assignee: { name: string; avatarUrl: string | null } | null;
    project: { id: string; name: string };
  }>;
}

function TaskSection({ title, badge, tasks }: TaskSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <Badge variant={badge}>{tasks.length}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="relative">
            <TaskCard task={task} />
            <span className="absolute top-2 right-2 text-xs text-gray-400">
              {task.project.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
