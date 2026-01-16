import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { formatRelativeDate } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    updatedAt: Date;
    owner: {
      name: string;
      avatarUrl: string | null;
    };
    _count: {
      tasks: number;
      members: number;
    };
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 truncate">
            {project.name}
          </h3>
          <Badge variant={project.status === "active" ? "success" : "default"}>
            {project.status}
          </Badge>
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={project.owner.name} size="xs" />
            <span className="text-sm text-gray-500">
              {project._count.tasks} tasks
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Updated {formatRelativeDate(project.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
