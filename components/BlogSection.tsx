import { prisma } from "@/lib/prisma";
import BlogClient from "./BlogClient";

export default async function BlogSection() {
  try {
    const rawPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    if (!rawPosts || rawPosts.length === 0) {
      return (
        <section id="blog" className="py-24 bg-bg-dark/50 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-center">
              No articles published yet. Check back soon.
            </p>
          </div>
        </section>
      );
    }

    const posts = rawPosts.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      category: p.category,
      readTime: p.readTime,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      coverImage: p.coverImage,
    }));

    return <BlogClient posts={posts} />;
  } catch (error) {
    console.error("Failed to query blog posts from database:", error);
    return (
      <section id="blog" className="py-24 bg-bg-dark/50 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-center">
            No articles published yet. Check back soon.
          </p>
        </div>
      </section>
    );
  }
}
