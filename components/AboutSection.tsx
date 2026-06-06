"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
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

  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "30+", label: "Happy Clients" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-bg-dark/50 border-t border-white/5 relative"
    >
      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 reveal ${
          isVisible ? "active" : ""
        }`}
      >
        {/* Section Heading */}
        <div className="mb-16">
          <span className="text-sm font-semibold tracking-widest text-accent-blue uppercase block mb-3">
            Biography
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
            About Me
          </h2>
          <div className="w-12 h-1 bg-linear-to-r from-accent-blue to-accent-purple mt-4 rounded-full"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-20">
          {/* Left Side (60%) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-heading text-xl md:text-2xl font-semibold text-text-primary">
              I am a Full-Stack Developer driven by turning complex problems into elegant digital solutions.
            </h3>
            <p className="text-text-muted leading-relaxed">
              With over 5 years of industry experience, I specialize in engineering robust web systems. I work extensively across the stack using modern tools like Next.js, React, Node.js, and PostgreSQL. I have a deep passion for building high-performance architectures, developing clean APIs, and creating responsive user experiences that feel fluid and premium.
            </p>
            <p className="text-text-muted leading-relaxed">
              My approach focuses on writing modular, self-documenting code and designing database schemas that scale. Whether architecting cloud infrastructure on AWS, containerizing environments with Docker, or micro-tuning database queries, I strive to build applications that deliver real business value and exceptional user experiences.
            </p>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {["#React", "#Node.js", "#PostgreSQL", "#Docker", "#AWS", "#Next.js", "#TypeScript"].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-accent-purple tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Download Button */}
            <div className="pt-4">
              <a
                href="/api/cv/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent-blue text-accent-blue hover:text-text-primary hover:bg-accent-blue rounded-md font-medium text-sm transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                Download CV
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Side (40%) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto">
              {/* Decorative background glow */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl" />

              {/* Photo */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/images/mahmoud-rizk.jpg"
                  alt="Mahmoud Rizk — Full-Stack Developer"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 glass px-4 py-2.5 rounded-lg flex items-center gap-2 animate-float">
                <span className="text-lg">🚀</span>
                <div>
                  <div className="text-xs font-bold text-accent-blue font-heading">50+</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Projects Completed</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 glass px-4 py-2.5 rounded-lg flex items-center gap-2 animate-float" style={{ animationDelay: "-3s" }}>
                <span className="text-lg">🏆</span>
                <div>
                  <div className="text-xs font-bold text-accent-purple font-heading">5+</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-white/5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass p-6 rounded-lg text-center relative overflow-hidden group hover:border-accent-blue/30 transition-all duration-300"
            >
              {/* Glow overlay */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-blue/5 rounded-full blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
              
              <div className="font-heading text-4xl md:text-5xl font-black bg-linear-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
