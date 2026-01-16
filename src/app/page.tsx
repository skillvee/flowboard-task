import Link from "next/link";
import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { ActivityFeed } from "@/components/activity-feed";
import { db } from "@/lib/db";

export default async function HomePage() {
  const projects = await db.project.findMany({
    include: {
      owner: true,
      _count: {
        select: { tasks: true, members: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });

  const recentActivity = await db.activity.findMany({
    include: {
      user: true,
      project: true,
      task: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here&apos;s an overview of your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Projects
              </h2>
              <Link
                href="/projects"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {projects.length === 0 && (
                <p className="text-gray-500 col-span-2">
                  No projects yet. Create your first project to get started!
                </p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>
      </main>
    </>
  );
}
