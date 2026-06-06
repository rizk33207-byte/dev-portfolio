import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsSection() {
  try {
    const rawProjects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });

    if (!rawProjects || rawProjects.length === 0) {
      return (
        <section id="projects" className="py-24 bg-bg-dark/50 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-center">
              No projects yet. Check back soon.
            </p>
          </div>
        </section>
      );
    }

    const projects = rawProjects.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      techStack: JSON.parse(p.techStack) as string[],
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      category: p.category as "fullstack" | "frontend" | "backend",
      featured: p.featured,
      thumbnail: p.thumbnail,
    }));

    return <ProjectsClient initialProjects={projects} />;
  } catch (error) {
    console.error("Failed to query projects from database:", error);
    return (
      <section id="projects" className="py-24 bg-bg-dark/50 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-center">
            No projects yet. Check back soon.
          </p>
        </div>
      </section>
    );
  }
}
