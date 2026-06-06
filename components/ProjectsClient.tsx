"use client";

import { useEffect, useState, useRef } from "react";

interface ProjectUI {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  category: "fullstack" | "frontend" | "backend";
  featured: boolean;
  thumbnail: string | null;
}

interface ProjectsClientProps {
  initialProjects: ProjectUI[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [filter, setFilter] = useState<"all" | "fullstack" | "frontend" | "backend">("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getGradient = (category: string, index: number) => {
    const gradients = [
      "from-blue-600/40 via-indigo-900/40 to-slate-900",
      "from-purple-600/40 via-violet-900/40 to-slate-900",
      "from-emerald-600/40 via-teal-900/40 to-slate-900",
      "from-amber-600/40 via-orange-900/40 to-slate-900",
      "from-pink-600/40 via-rose-900/40 to-slate-900",
      "from-cyan-600/40 via-sky-900/40 to-slate-900",
    ];
    if (category === "fullstack") return gradients[index % 2];
    if (category === "frontend") return gradients[(index % 2) + 2];
    return gradients[(index % 2) + 4];
  };

  const filteredProjects =
    filter === "all" ? initialProjects : initialProjects.filter((p) => p.category === filter);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 bg-bg-dark/50 border-t border-white/5 relative"
    >
      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 reveal ${
          isVisible ? "active" : ""
        }`}
      >
        {/* Section Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-sm font-semibold tracking-widest text-accent-blue uppercase block mb-3">
            Creations
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
            Featured Projects
          </h2>
          <div className="w-12 h-1 bg-linear-to-r from-accent-blue to-accent-purple mt-4 rounded-full"></div>
        </div>

        {/* Filters Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
            {(["all", "fullstack", "frontend", "backend"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-300 capitalize cursor-pointer ${
                  filter === cat
                    ? "bg-accent-blue text-text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {cat === "all" ? "All Projects" : cat === "fullstack" ? "Full-Stack" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No projects yet under this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="glass-card flex flex-col overflow-hidden group border border-white/5"
              >
                {/* Colored Gradient Thumbnail Placeholder */}
                <div className={`relative h-48 w-full bg-linear-to-br ${getGradient(project.category, idx)} flex items-center justify-center overflow-hidden border-b border-white/5`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                  
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="font-heading font-bold text-xl text-text-primary/40 group-hover:scale-110 transition-transform duration-500 select-none">
                      {project.title.substring(0, 3).toUpperCase()}
                    </div>
                  )}

                  {/* Floating Category Badge */}
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded bg-bg-dark/70 border border-white/10 text-[10px] font-mono tracking-wider uppercase text-accent-blue font-semibold z-10">
                    {project.category === "fullstack" ? "Full-Stack" : project.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 grow flex flex-col justify-between">
                  <div>
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-text-muted border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-2 group-hover:text-accent-blue transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Row Links */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {/* Github Outlined Link */}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary rounded-md transition-all duration-300"
                        aria-label="View Github Repository"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                      </a>
                    ) : (
                      <div />
                    )}

                    {/* Live Demo Action */}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-blue text-text-primary rounded-md font-medium text-xs transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      >
                        Live Demo
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                      </a>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
