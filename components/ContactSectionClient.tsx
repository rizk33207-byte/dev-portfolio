"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  email: string | null;
  phone: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
}

export default function ContactSectionClient({
  email,
  phone,
  location,
  github,
  linkedin,
  twitter,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        if (data.error && typeof data.error === "object") {
          const firstErrField = Object.keys(data.error)[0];
          const messages = data.error[firstErrField];
          setErrorMsg(messages?.[0] || "Invalid details provided.");
        } else {
          setErrorMsg(data.error || "An error occurred. Please try again.");
        }
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMsg("Failed to connect to the server. Please check your connection.");
    }
  };

  // Resolved values with fallbacks
  const displayEmail = email || "mahmoud@example.com";
  const displayLocation = location || "Cairo, Egypt";
  const githubHref = github || "#";
  const linkedinHref = linkedin || "#";
  const twitterHref = twitter || "#";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 bg-bg-dark relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute left-1/4 top-1/2 w-[300px] h-[300px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 reveal ${
          isVisible ? "active" : ""
        }`}
      >
        {/* Section Heading */}
        <div className="mb-16">
          <span className="text-sm font-semibold tracking-widest text-accent-blue uppercase block mb-3">
            Get In Touch
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
            Let's Work Together
          </h2>
          <div className="w-12 h-1 bg-linear-to-r from-accent-blue to-accent-purple mt-4 rounded-full"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Contact info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <h3 className="font-heading text-xl md:text-2xl font-bold text-text-primary">
                Have a project in mind or just want to chat?
              </h3>
              <p className="text-text-muted leading-relaxed">
                Feel free to reach out. I'm always open to discussing new development opportunities, open-source collaborations, or custom architectures.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {/* Email */}
              <div className="glass p-4 rounded-lg flex items-center gap-4 hover:border-accent-blue/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold font-mono">Email Me</div>
                  <a href={`mailto:${displayEmail}`} className="text-sm font-medium text-text-primary hover:text-accent-blue transition-colors duration-300">
                    {displayEmail}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="glass p-4 rounded-lg flex items-center gap-4 hover:border-accent-blue/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold font-mono">Location</div>
                  <div className="text-sm font-medium text-text-primary">
                    {displayLocation}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="glass p-4 rounded-lg flex items-center gap-4 hover:border-accent-blue/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold font-mono">Availability</div>
                  <div className="text-sm font-medium text-text-primary flex items-center gap-2">
                    Open to Work
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="flex gap-4 pt-4">
              {/* GitHub */}
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary rounded-md flex items-center justify-center transition-all duration-300"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinHref}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary rounded-md flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* Twitter */}
              <a
                href={twitterHref}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary rounded-md flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Contact form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass p-8 md:p-10 rounded-xl border border-white/5 relative">
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="text-green-400 text-5xl mb-4">✓</div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-400">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-bg-dark/60 border border-white/10 hover:border-white/20 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted/40 outline-none transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-bg-dark/60 border border-white/10 hover:border-white/20 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted/40 outline-none transition-all duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-bg-dark/60 border border-white/10 hover:border-white/20 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted/40 outline-none transition-all duration-300"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-bg-dark/60 border border-white/10 hover:border-white/20 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted/40 outline-none transition-all duration-300 resize-none"
                      placeholder="Tell me about your project details..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 bg-linear-to-r from-accent-blue to-accent-purple hover:opacity-95 text-text-primary rounded-md font-medium text-sm transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>

                  {/* Error State */}
                  {status === "error" && (
                    <p className="text-red-400 text-sm mt-2 text-center">{errorMsg}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
