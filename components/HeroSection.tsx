"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const targetElement = document.querySelector("#projects");
    if (targetElement) {
      const offsetTop = (targetElement as HTMLElement).offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden dot-grid">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-2/3 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "-3s" }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Available Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-text-primary tracking-wide">
            Available for Work <span className="text-accent-blue font-bold">✦</span>
          </span>
        </div>

        {/* Main H1 Headline */}
        <h1
          className={`font-heading text-5xl md:text-7xl font-bold tracking-tight text-text-primary mb-6 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Building Digital <br />
          <span className="bg-linear-to-r from-accent-blue via-[#60A5FA] to-accent-purple bg-clip-text text-transparent">
            Experiences
          </span>
        </h1>

        {/* Subheading */}
        <p
          className={`max-w-2xl text-lg md:text-xl text-text-muted mb-10 leading-relaxed transition-all duration-1000 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Full-Stack Developer crafting scalable web applications with modern technologies.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-1000 delay-600 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={scrollToProjects}
            className="px-8 py-3.5 bg-accent-blue hover:bg-accent-blue/90 text-text-primary rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] cursor-pointer"
          >
            View My Work
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
          <a
            href="/api/cv/download"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-text-primary rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md"
          >
            Download CV
            <svg
              className="w-4 h-4 text-text-muted"
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

        {/* Tech Logos Row */}
        <div
          className={`w-full max-w-3xl border-t border-white/5 pt-10 transition-all duration-1000 delay-800 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-text-muted/60 mb-6 font-semibold">
            Tech Stack Focus
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {/* React */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <ellipse cx="12" cy="12" rx="10" ry="4"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
              </svg>
              <span className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors duration-300">React</span>
            </div>

            {/* Next.js */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-text-primary bg-black rounded-full p-0.5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" fill="black" stroke="white" strokeWidth="4"/>
                <path d="M72 28L39 71.3H31.5V28H39V58.3L65 28H72Z" fill="white"/>
                <path d="M73 28H65.5V72H73V28Z" fill="white"/>
              </svg>
              <span className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors duration-300">Next.js</span>
            </div>

            {/* Node.js */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 6.5v9L12 22l8-4.5v-9L12 2zm6 12.3l-6 3.4-6-3.4V7.7l6-3.4 6 3.4v8.6z"/>
                <path d="M12 7.7l4 2.3v4.6l-4 2.3-4-2.3V10l4-2.3z" opacity="0.5"/>
              </svg>
              <span className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors duration-300">Node.js</span>
            </div>

            {/* TypeScript */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-blue-500 rounded group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                <rect width="24" height="24" rx="3" fill="#3178C6"/>
                <path d="M6 8h7v2H10v6H8v-6H6V8zm7.5 4.5c.8 0 1.5.4 1.5 1s-.7 1-1.5 1h-1.5v2H12V10.5h1.5zm.5 1v-1h-1v1h1z" fill="white"/>
              </svg>
              <span className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors duration-300">TypeScript</span>
            </div>

            {/* PostgreSQL */}
            <div className="flex items-center gap-2 group cursor-default">
              <svg className="w-6 h-6 text-sky-600 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.66 0 3 1.34 3 3v1.9c1.24.44 2 1.61 2 2.92 0 .9-.38 1.72-1 2.31z"/>
              </svg>
              <span className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors duration-300">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10" onClick={(e) => {
        const targetElement = document.querySelector("#about");
        if (targetElement) {
          window.scrollTo({
            top: (targetElement as HTMLElement).offsetTop - 80,
            behavior: "smooth",
          });
        }
      }}>
        <span className="text-[10px] uppercase tracking-widest text-text-muted/50 font-bold">Scroll Down</span>
        <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center p-1.5">
          <div className="w-1 h-2 bg-accent-blue rounded-full animate-scroll-down"></div>
        </div>
      </div>
    </section>
  );
}
