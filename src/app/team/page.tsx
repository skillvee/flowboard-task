import { Header } from "@/components/header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatRelativeDate } from "@/lib/utils";

export default async function TeamPage() {
  const users = await db.user.findMany({
    include: {
      _count: {
        select: {
          assignedTasks: true,
          ownedProjects: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="mt-2 text-gray-600">
            View all team members and their activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <Avatar name={user.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant={user.role === "admin" ? "info" : "default"}
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {user._count.assignedTasks}
                    </div>
                    <div className="text-xs text-gray-500">Assigned Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {user._count.ownedProjects}
                    </div>
                    <div className="text-xs text-gray-500">Projects Owned</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400 text-center">
                  Joined {formatRelativeDate(user.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
