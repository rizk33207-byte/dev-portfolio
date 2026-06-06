"use client";

interface Props {
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
}

export default function FooterClient({ github, linkedin, twitter }: Props) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offsetTop = (targetElement as HTMLElement).offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const githubHref = github || "#";
  const linkedinHref = linkedin || "#";
  const twitterHref = twitter || "#";

  return (
    <footer className="bg-bg-dark border-t border-white/5 py-12 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-8 border-b border-white/5">
          {/* Left Side: Brand Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-full bg-linear-to-tr from-accent-blue to-accent-purple flex items-center justify-center text-text-primary font-heading font-bold text-base shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                MR
              </div>
              <span className="font-heading font-semibold text-base tracking-wide text-text-primary group-hover:text-accent-blue transition-colors">
                Mahmoud Rizk
              </span>
            </a>
            <p className="text-xs text-text-muted max-w-xs leading-relaxed">
              Crafting premium digital experiences, robust databases, and scalable full-stack web applications.
            </p>
          </div>

          {/* Center: Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { label: "About", href: "#about" },
              { label: "Skills", href: "#skills" },
              { label: "Projects", href: "#projects" },
              { label: "Experience", href: "#experience" },
              { label: "Blog", href: "#blog" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-text-muted hover:text-accent-blue transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side: Social Media Icons */}
          <div className="flex gap-4">
            {/* GitHub */}
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary rounded-md flex items-center justify-center transition-all duration-300"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinHref}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary rounded-md flex items-center justify-center transition-all duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* Twitter */}
            <a
              href={twitterHref}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary rounded-md flex items-center justify-center transition-all duration-300"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-text-muted font-mono">
          <p>© {new Date().getFullYear()} Mahmoud Rizk. Built with Next.js</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-accent-blue transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-accent-blue transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
