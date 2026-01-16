import Link from "next/link";
import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    include: {
      owner: true,
      _count: {
        select: { tasks: true, members: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600">
              Manage and track all your projects
            </p>
          </div>
          <Link href="/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects yet"
            description="Get started by creating your first project"
            action={{
              label: "Create Project",
              onClick: () => {},
            }}
          />
        )}
      </main>
    </>
  );
}
