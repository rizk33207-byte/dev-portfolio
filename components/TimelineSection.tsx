"use client";

import { useEffect, useState, useRef } from "react";

interface TimelineItem {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  bullets: string[];
}

export default function TimelineSection() {
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");
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

  const workItems: TimelineItem[] = [
    {
      title: "Senior Full-Stack Developer",
      subtitle: "Tech Company",
      date: "2022 – Present",
      location: "Cairo, Egypt (Hybrid)",
      bullets: [
        "Architected and deployed microservices handling 100K+ monthly active users, reducing API latency by 35% through Redis caching layers.",
        "Led a team of 4 engineers to build a core Next.js 14 SaaS management dashboard, optimizing performance to score 98+ on Web Vitals.",
        "Created CI/CD pipelines using GitHub Actions, containerizing environments with Docker and automating deployments to AWS ECS.",
        "Refactored legacy relational schemas into optimized PostgreSQL models, improving query response times by 50%."
      ],
    },
    {
      title: "Full-Stack Developer",
      subtitle: "Digital Agency",
      date: "2020 – 2022",
      location: "Alexandria, Egypt (On-site)",
      bullets: [
        "Developed and launched 12 custom client applications using React, Express.js, and MongoDB, delivering all ahead of schedule.",
        "Integrated third-party payment getaways (Stripe, PayPal) and built secure JWT-based authorization and session management flows.",
        "Worked closely with UI/UX designers to translate Figma mockups into fully accessible (WCAG) and responsive front-end views.",
        "Optimized client databases by adding database indexing, query optimization, and structured audit logs."
      ],
    },
    {
      title: "Junior Developer",
      subtitle: "Startup Inc.",
      date: "2019 – 2020",
      location: "Remote",
      bullets: [
        "Contributed to frontend feature development using HTML/CSS, JavaScript, and React, fixing 80+ critical layout bugs.",
        "Assisted in backend REST API design and endpoint implementation using Node.js and SQLite.",
        "Wrote comprehensive unit and integration tests using Jest and Supertest, expanding codebase coverage by 25%.",
        "Participated in agile ceremonies, daily standups, and structured peer-to-peer code reviews."
      ],
    },
  ];

  const educationItems: TimelineItem[] = [
    {
      title: "B.Sc. Computer Science",
      subtitle: "Cairo University",
      date: "2015 – 2019",
      location: "Cairo, Egypt",
      bullets: [
        "Graduated with Honors, majoring in Software Engineering and Distributed Systems.",
        "Coursework: Algorithms & Data Structures, DBMS, Software Design Patterns, Computer Networks, and Cloud Computing.",
        "Completed graduation project: A decentralized IoT file-sharing network using Node.js and Ethereum Smart Contracts.",
        "Active member of the ACM student chapter, competing in local programming events."
      ],
    },
  ];

  const items = activeTab === "work" ? workItems : educationItems;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 bg-bg-dark relative overflow-hidden"
    >
      {/* Visual background element */}
      <div className="absolute left-0 bottom-1/4 w-[250px] h-[250px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div
        className={`max-w-5xl mx-auto px-6 reveal ${
          isVisible ? "active" : ""
        }`}
      >
        {/* Section Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-sm font-semibold tracking-widest text-accent-blue uppercase block mb-3">
            Journey
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
            Experience & Education
          </h2>
          <div className="w-12 h-1 bg-linear-to-r from-accent-blue to-accent-purple mt-4 rounded-full"></div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
            <button
              onClick={() => setActiveTab("work")}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "work"
                  ? "bg-accent-blue text-text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Work Experience
            </button>
            <button
              onClick={() => setActiveTab("education")}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "education"
                  ? "bg-accent-blue text-text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Education
            </button>
          </div>
        </div>

        {/* Vertical Timeline — flex-row layout: [date | dot-column | card] */}
        <div className="flex flex-col gap-0">
          {items.map((item, idx) => (
            <div
              key={item.title + idx}
              className="flex items-start gap-0 mb-12 last:mb-0"
            >
              {/* LEFT: Date pill — hidden on mobile, right-aligned on desktop */}
              <div className="hidden md:flex w-1/3 justify-end pr-6 pt-5">
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-accent-blue font-semibold tracking-wider uppercase whitespace-nowrap">
                  {item.date}
                </span>
              </div>

              {/* CENTER: Vertical line + glowing dot */}
              <div className="flex flex-col items-center shrink-0 w-10 md:w-12">
                {/* Dot */}
                <div className="mt-4 w-5 h-5 rounded-full bg-bg-dark border-2 border-accent-blue flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.7)] z-10 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent-purple animate-ping opacity-75"></div>
                </div>
                {/* Line below dot — stretches to fill the item height */}
                {idx < items.length - 1 && (
                  <div className="flex-1 w-px bg-linear-to-b from-accent-blue/40 via-accent-purple/30 to-transparent mt-2 min-h-8"></div>
                )}
              </div>

              {/* RIGHT: Card content */}
              <div className="flex-1 pl-4 md:pl-6 pb-4">
                {/* Mobile-only date pill */}
                <span className="inline-block md:hidden px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-accent-blue font-semibold tracking-wider uppercase mb-3">
                  {item.date}
                </span>

                {/* Glass Card */}
                <div className="glass p-6 rounded-xl hover:border-accent-blue/30 transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-heading font-bold text-text-primary text-lg md:text-xl leading-snug">
                        {item.title}
                      </h3>
                      <div className="text-sm text-accent-blue font-medium mt-1">
                        {item.subtitle}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5 whitespace-nowrap">
                      📍 {item.location}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-text-muted text-sm list-none pl-0">
                    {item.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="flex gap-2.5 items-start leading-relaxed">
                        <span className="text-accent-purple text-xs mt-1.5 shrink-0">✦</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
