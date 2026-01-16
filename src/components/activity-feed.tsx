import { Avatar } from "./ui/avatar";
import { formatRelativeDate } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  createdAt: Date;
  metadata: unknown;
  user: {
    name: string;
    avatarUrl: string | null;
  };
  project: {
    name: string;
  } | null;
  task: {
    title: string;
  } | null;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const description = getActivityDescription(activity);

  return (
    <div className="p-4 flex gap-3">
      <Avatar name={activity.user.name} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{activity.user.name}</span>{" "}
          {description}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatRelativeDate(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}

function getActivityDescription(activity: Activity): string {
  switch (activity.type) {
    case "project_created":
      return `created project "${activity.project?.name}"`;
    case "task_created":
      return `created task "${activity.task?.title}"`;
    case "task_assigned":
      return `was assigned to "${activity.task?.title}"`;
    case "task_completed":
      return `completed "${activity.task?.title}"`;
    case "task_updated":
      return `updated "${activity.task?.title}"`;
    case "comment_added":
      return `commented on "${activity.task?.title}"`;
    default:
      return "performed an action";
  }
}
