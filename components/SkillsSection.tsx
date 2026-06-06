"use client";

import { useEffect, useState, useRef } from "react";

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
}

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState<"frontend" | "backend" | "devops">("frontend");
  const [isVisible, setIsVisible] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Small delay before animating the bars to make it visible to the user
          setTimeout(() => setAnimateBars(true), 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
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

  // Trigger re-animation when switching tabs
  useEffect(() => {
    if (isVisible) {
      setAnimateBars(false);
      const timer = setTimeout(() => setAnimateBars(true), 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isVisible]);

  const skillsData: Record<"frontend" | "backend" | "devops", Skill[]> = {
    frontend: [
      {
        name: "React",
        level: 95,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <ellipse cx="12" cy="12" rx="10" ry="4"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
          </svg>
        ),
      },
      {
        name: "Next.js",
        level: 92,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" fill="currentColor" stroke="currentColor" strokeWidth="2" fillOpacity="0.1"/>
            <path d="M72 28L39 71.3H31.5V28H39V58.3L65 28H72Z" fill="currentColor"/>
            <path d="M73 28H65.5V72H73V28Z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: "TypeScript",
        level: 90,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <rect width="24" height="24" rx="3" fill="currentColor" fillOpacity="0.1"/>
            <path d="M6 8h7v2H10v6H8v-6H6V8zm7.5 4.5c.8 0 1.5.4 1.5 1s-.7 1-1.5 1h-1.5v2H12V10.5h1.5zm.5 1v-1h-1v1h1z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: "Tailwind CSS",
        level: 88,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6.096c-2.482 0-3.92 1.24-4.314 3.72 1.242-1.55 2.693-1.86 4.352-.93 1.155.65 1.98 1.48 2.894 2.41 1.49 1.517 3.2 3.26 6.84 3.26 2.482 0 3.92-1.24 4.314-3.72-1.24 1.55-2.693 1.86-4.35.93-1.156-.65-1.98-1.48-2.896-2.41-1.488-1.52-3.2-3.26-6.84-3.26zm-8 6.904c-2.482 0-3.92 1.24-4.314 3.72 1.242-1.55 2.693-1.86 4.352-.93 1.155.65 1.98 1.48 2.894 2.41 1.49 1.516 3.2 3.26 6.84 3.26 2.482 0 3.92-1.24 4.314-3.72-1.24 1.55-2.693 1.86-4.35.93-1.156-.65-1.98-1.48-2.896-2.41-1.488-1.52-3.2-3.26-6.84-3.26z"/>
          </svg>
        ),
      },
      {
        name: "Framer Motion",
        level: 80,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 12h20L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22L2 12h20L12 22z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12h20" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
    backend: [
      {
        name: "Node.js",
        level: 90,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L4 6.5v9L12 22l8-4.5v-9L12 2z"/>
            <path d="M12 6.5L6 10v4l6 3.5 6-3.5v-4z" opacity="0.5"/>
          </svg>
        ),
      },
      {
        name: "Express",
        level: 88,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.1"/>
            <path d="M7 8h10M7 12h7M7 16h10" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        name: "PostgreSQL",
        level: 85,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.66 0 3 1.34 3 3v1.9c1.24.44 2 1.61 2 2.92 0 .9-.38 1.72-1 2.31z"/>
          </svg>
        ),
      },
      {
        name: "Redis",
        level: 80,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        ),
      },
      {
        name: "REST API",
        level: 92,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6" cy="6" r="3"/>
            <circle cx="18" cy="18" r="3"/>
            <path d="M6 9v6a3 3 0 003 3h6M18 15v-6a3 3 0 00-3-3h-6" strokeDasharray="2 2"/>
          </svg>
        ),
      },
      {
        name: "GraphQL",
        level: 75,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2.5 7.5v11L12 22l9.5-5.5v-11L12 2zm0 2.23l7.5 4.33v8.66L12 19.55l-7.5-4.33V8.56l7.5-4.33z"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        ),
      },
    ],
    devops: [
      {
        name: "Docker",
        level: 82,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.983 11.078h2.119v-2.006h-2.119v2.006zm-2.825 0h2.118v-2.006h-2.118v2.006zm-2.825 0h2.118v-2.006H8.333v2.006zm-2.825 0h2.119v-2.006H5.508v2.006zm-2.825 0h2.119v-2.006H2.683v2.006zm8.29-2.829h2.118V6.243h-2.118v2.006zm-2.825 0h2.118V6.243H8.333v2.006zm-2.825 0h2.119V6.243H5.508v2.006zm5.65-2.829h2.118V3.414h-2.118v2.006zm11.003 6.012c-.223-.071-.482-.097-.736-.097h-2.617c-.453.003-.896.177-1.233.486-.33.303-.541.716-.593 1.163-.075.642-.258 1.258-.54 1.831-.383.782-.99 1.439-1.745 1.89-1.247.746-2.714.97-4.131.626l-.427-.104c-.389-.093-.762-.236-1.11-.424-.467-.253-.846-.628-1.096-1.085a2.531 2.531 0 01-.336-1.24c.006-.407.125-.806.342-1.149.231-.365.57-.643.967-.788l.189-.068a15.82 15.82 0 002.39-1.222c.983-.65 1.764-1.543 2.268-2.59.186-.388.358-.783.518-1.189a5.19 5.19 0 00.222-1.777l-.004-.33c-.015-.658-.337-1.274-.863-1.67-.54-.408-1.232-.527-1.874-.325l-.264.083c-.456.143-.883.376-1.26.685a3.993 3.993 0 00-1.164 1.782c-.247.734-.596 1.428-1.034 2.062a4.912 4.912 0 01-1.921 1.747 16.48 16.48 0 00-2.316 1.25c-.247.168-.522.287-.813.351L1.047 13.91c-.398.087-.77.265-1.077.52a2.036 2.036 0 00-.73 1.488 2.072 2.072 0 00.72 1.493c.404.341.928.514 1.458.482.909-.056 1.815.023 2.7.234 1.78.423 3.42 1.34 4.74 2.65 1.495 1.485 3.51 2.308 5.61 2.3h4.636c2.404.004 4.72-.924 6.467-2.59a9.141 9.141 0 002.483-6.417c.01-.643-.078-1.285-.262-1.9zm-16.145.48h2.118v-2.006h-2.118v2.006z"/>
          </svg>
        ),
      },
      {
        name: "AWS",
        level: 75,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 12.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        ),
      },
      {
        name: "GitHub Actions",
        level: 85,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        ),
      },
      {
        name: "Vercel",
        level: 90,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 22.525H0L12 1.475L24 22.525Z"/>
          </svg>
        ),
      },
      {
        name: "Linux",
        level: 78,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        ),
      },
      {
        name: "Nginx",
        level: 70,
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 12.5c0 1.38-1.12 2.5-2.5 2.5H11v-1.5h3.5c.55 0 1-.45 1-1V11H11v-1.5h4.5c1.38 0 2.5 1.12 2.5 2.5v2.5zM9 11v1.5h1.5V11H9zm0 3.5V16h1.5v-1.5H9z"/>
          </svg>
        ),
      },
    ],
  };

  const currentSkills = skillsData[activeTab];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 bg-bg-dark relative overflow-hidden"
    >
      {/* Visual background element */}
      <div className="absolute right-0 top-1/4 w-[300px] h-[300px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 reveal ${
          isVisible ? "active" : ""
        }`}
      >
        {/* Section Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-sm font-semibold tracking-widest text-accent-blue uppercase block mb-3">
            Abilities
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
            Tech Stack
          </h2>
          <div className="w-12 h-1 bg-linear-to-r from-accent-blue to-accent-purple mt-4 rounded-full"></div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
            {(["frontend", "backend", "devops"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 capitalize cursor-pointer ${
                  activeTab === tab
                    ? "bg-accent-blue text-text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab === "devops" ? "DevOps & Tools" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSkills.map((skill, idx) => (
            <div
              key={skill.name}
              className="glass p-6 rounded-xl relative group hover:border-accent-blue/20 transition-all duration-300"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-5">
                {/* Icon Circle */}
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent-blue group-hover:bg-accent-blue group-hover:text-text-primary transition-all duration-300 shadow-inner">
                  {skill.icon}
                </div>
                <div className="grow">
                  <h3 className="font-heading font-semibold text-text-primary text-base">
                    {skill.name}
                  </h3>
                </div>
                <span className="font-mono text-sm text-accent-purple font-semibold">
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-accent-blue to-accent-purple rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animateBars ? `${skill.level}%` : "0%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
