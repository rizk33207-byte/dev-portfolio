"use client";

import { useEffect, useState, useRef } from "react";

interface BlogPostUI {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string | null;
  coverImage: string | null;
}

interface BlogClientProps {
  posts: BlogPostUI[];
}

export default function BlogClient({ posts }: BlogClientProps) {
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

  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-600/30 via-indigo-900/30 to-bg-dark",
      "from-purple-600/30 via-violet-900/30 to-bg-dark",
      "from-emerald-600/30 via-teal-900/30 to-bg-dark",
    ];
    return gradients[index % gradients.length];
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Draft";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section
      id="blog"
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
            Publications
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
            Latest Articles
          </h2>
          <div className="w-12 h-1 bg-linear-to-r from-accent-blue to-accent-purple mt-4 rounded-full"></div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post, idx) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass-card flex flex-col overflow-hidden group border border-white/5 cursor-pointer"
            >
              {/* Colored Gradient Image Placeholder */}
              <div className={`relative h-44 w-full bg-linear-to-br ${getGradient(idx)} flex items-center justify-center border-b border-white/5`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/5 to-transparent"></div>
                
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="font-heading font-black text-xl text-text-primary/20 tracking-wider group-hover:scale-105 transition-transform duration-500">
                    {post.category.toUpperCase()}
                  </span>
                )}

                {/* Floating Category Badge */}
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded bg-bg-dark/70 border border-white/10 text-[10px] font-mono tracking-wider uppercase text-accent-blue font-semibold z-10">
                  {post.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 grow flex flex-col justify-between">
                <div>
                  {/* Article Title */}
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors duration-300 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  {/* Excerpt */}
                  <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-text-muted font-mono">
                  <div className="flex items-center gap-2">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <span className="text-accent-blue font-semibold hover:text-accent-purple transition-all duration-300 flex items-center gap-1 group-hover:translate-x-1">
                    Read More <span>→</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <a
            href="/blog"
            className="px-6 py-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-text-primary rounded-md font-medium text-sm transition-all duration-300 backdrop-blur-md cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            View All Articles
          </a>
        </div>
      </div>
    </section>
  );
}
