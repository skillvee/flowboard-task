import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { formatDate, getPriorityColor } from "@/lib/utils";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    assignee: {
      name: string;
      avatarUrl: string | null;
    } | null;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
            {task.title}
          </h4>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>

        {task.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {task.assignee ? (
            <Avatar name={task.assignee.name} size="xs" />
          ) : (
            <span className="text-xs text-gray-400">Unassigned</span>
          )}
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              Due {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
