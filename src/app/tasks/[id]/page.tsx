import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate, formatRelativeDate, getPriorityColor, getStatusColor } from "@/lib/utils";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;

  const task = await db.task.findUnique({
    where: { id },
    include: {
      project: {
        select: { id: true, name: true },
      },
      assignee: true,
      creator: true,
      labels: {
        include: { label: true },
      },
      comments: {
        include: {
          author: true,
          replies: {
            include: { author: true },
          },
        },
        where: { parentId: null },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-500">
          <Link href="/projects" className="hover:text-gray-700">
            Projects
          </Link>
          {" / "}
          <Link
            href={`/projects/${task.project.id}`}
            className="hover:text-gray-700"
          >
            {task.project.name}
          </Link>
          {" / "}
          <span className="text-gray-900">Task</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {task.title}
                  </h1>
                  <Button variant="secondary">Edit</Button>
                </div>
              </CardHeader>
              <CardContent>
                {task.description ? (
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No description</p>
                )}

                {/* Labels */}
                {task.labels.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {task.labels.map(({ label }) => (
                      <Badge
                        key={label.id}
                        style={{ backgroundColor: label.color + "20", color: label.color }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-lg font-semibold">
                  Comments ({task.comments.length})
                </h2>
              </CardHeader>
              <CardContent>
                {task.comments.length > 0 ? (
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No comments yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card>
              <CardContent className="py-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Priority
                    </label>
                    <div className="mt-1">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Assignee
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {task.assignee ? (
                        <>
                          <Avatar name={task.assignee.name} size="sm" />
                          <span>{task.assignee.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </div>
                  </div>

                  {task.dueDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Due Date
                      </label>
                      <div className="mt-1">{formatDate(task.dueDate)}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardContent className="py-4 text-sm text-gray-500">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Created by</span>
                    <Avatar name={task.creator.name} size="xs" />
                    <span>{task.creator.name}</span>
                  </div>
                  <div>Created {formatRelativeDate(task.createdAt)}</div>
                  <div>Updated {formatRelativeDate(task.updatedAt)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string; avatarUrl: string | null };
    replies: Array<{
      id: string;
      content: string;
      createdAt: Date;
      author: { name: string; avatarUrl: string | null };
    }>;
  };
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={comment.author.name} size="sm" />
        <span className="font-medium">{comment.author.name}</span>
        <span className="text-sm text-gray-400">
          {formatRelativeDate(comment.createdAt)}
        </span>
      </div>
      <p className="text-gray-700">{comment.content}</p>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 ml-4 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="border-l-2 border-gray-100 pl-3">
              <div className="flex items-center gap-2 mb-1">
                <Avatar name={reply.author.name} size="xs" />
                <span className="font-medium text-sm">{reply.author.name}</span>
                <span className="text-xs text-gray-400">
                  {formatRelativeDate(reply.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
