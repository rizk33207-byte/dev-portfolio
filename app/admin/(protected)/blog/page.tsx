"use client";

import { useState, useEffect } from "react";
import MediaUploader from "@/components/admin/MediaUploader";
import { useI18n } from "@/lib/admin-i18n";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  readTime: number;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPage() {
  const { t, isRTL } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [published, setPublished] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      const json = await res.json();
      if (json.success) {
        setPosts(json.data);
      } else {
        setError(json.error || (isRTL ? "فشل تحميل المقالات" : "Failed to load blog posts"));
      }
    } catch (err) {
      setError(isRTL ? "حدث خطأ أثناء جلب المقالات." : "An error occurred while fetching blog posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage || "");
    setCategory(post.category);
    setReadTime(post.readTime);
    setPublished(post.published);
    setFormErrors({});
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setCategory("");
    setReadTime(5);
    setPublished(false);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      coverImage: coverImage || undefined,
      category,
      readTime: Number(readTime),
      published,
    };

    try {
      const url = editingId ? `/api/blog/${editingId}` : "/api/blog";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        resetForm();
        setShowForm(false);
        fetchPosts();
      } else if (res.status === 400 && json.error) {
        setFormErrors(json.error);
      } else {
        alert(json.error || (isRTL ? "حدث خطأ أثناء حفظ المقال." : "An error occurred while saving the blog post."));
      }
    } catch (err) {
      alert(t.common.error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل أنت متأكد من حذف هذا المقال؟" : "Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        fetchPosts();
      } else {
        alert(json.error || (isRTL ? "فشل حذف المقال." : "Failed to delete blog post"));
      }
    } catch (err) {
      alert(isRTL ? "حدث خطأ أثناء حذف المقال." : "An error occurred while deleting the blog post.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">{t.blog.title}</h1>
          <p className="text-white/50 text-sm mt-1">{isRTL ? "نشر المقالات وتعديلها وأرشفتها." : "Publish, edit, or archive articles."}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            type="button"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            + {t.blog.newPost}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-lg font-semibold mb-4 text-white">
            {editingId ? (isRTL ? "تعديل المقال" : "Edit Post") : t.blog.newPost}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.blog.postTitle}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Next.js 15 Server Components"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.title && <p className="text-red-400 text-xs mt-1">{formErrors.title[0]}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  {isRTL ? "الرابط المختصر (اتركه فارغاً للتوليد التلقائي)" : "Slug (leave empty to auto-generate)"}
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. nextjs-15-server-components"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.slug && <p className="text-red-400 text-xs mt-1">{formErrors.slug[0]}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.blog.category}</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  placeholder="e.g. Next.js, CSS, Databases"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.category && <p className="text-red-400 text-xs mt-1">{formErrors.category[0]}</p>}
              </div>

              {/* Cover Image */}
              <div>
                <MediaUploader
                  endpoint="blogCover"
                  value={coverImage || null}
                  onChange={(url) => setCoverImage(url)}
                  accept="image"
                  label={t.blog.coverImage}
                />
                {formErrors.coverImage && <p className="text-red-400 text-xs mt-1">{formErrors.coverImage[0]}</p>}
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.blog.readTime}</label>
                <input
                  type="number"
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.readTime && <p className="text-red-400 text-xs mt-1">{formErrors.readTime[0]}</p>}
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3 mt-5">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-0"
                />
                <label htmlFor="published" className="text-sm font-medium text-white/70">
                  {isRTL ? "نشر فوراً (مرئي للعامة)" : "Publish immediately (Visible publicly)"}
                </label>
                {formErrors.published && <p className="text-red-400 text-xs mt-1">{formErrors.published[0]}</p>}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">{t.blog.excerpt}</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={2}
                placeholder="A brief summary for previews..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 resize-y"
              />
              {formErrors.excerpt && <p className="text-red-400 text-xs mt-1">{formErrors.excerpt[0]}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">{isRTL ? "المحتوى (يدعم Markdown)" : "Content (Markdown supported)"}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                placeholder="Write your article here..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 resize-y font-mono"
              />
              {formErrors.content && <p className="text-red-400 text-xs mt-1">{formErrors.content[0]}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-white/10 rounded-lg text-white/80 hover:bg-white/5 text-sm font-medium transition-colors cursor-pointer"
              >
                {t.blog.cancel}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-60 transition-colors cursor-pointer"
              >
                {submitting ? (isRTL ? "جاري الحفظ..." : "Saving...") : t.blog.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="text-white/50 text-sm">{t.common.loading}</div>
      ) : error ? (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-white/40 text-center py-10 bg-white/5 rounded-2xl border border-white/10">
          {t.blog.noData}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur">
          <div className="overflow-x-auto">
            <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse text-sm`}>
              <thead>
                <tr className="border-b border-white/10 text-white/50 font-medium bg-surface/50">
                  <th className="p-4">{t.blog.postTitle}</th>
                  <th className="p-4">{t.blog.category}</th>
                  <th className="p-4">{isRTL ? "وقت القراءة" : "Read Time"}</th>
                  <th className="p-4">{isRTL ? "الحالة" : "Status"}</th>
                  <th className="p-4">{isRTL ? "تاريخ الإنشاء" : "Created At"}</th>
                  <th className={`p-4 ${isRTL ? "text-left" : "text-right"}`}>{isRTL ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{post.title}</div>
                      <div className="text-xs text-white/40 font-mono">/{post.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4 text-white/75">
                      {post.readTime} {isRTL ? "دقائق" : "min"}
                    </td>
                    <td className="p-4">
                      {post.published ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          {isRTL ? "منشور" : "Published"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          {t.blog.draft}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-white/40">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`p-4 ${isRTL ? "text-left" : "text-right"} space-x-2`}>
                      <button
                        onClick={() => handleEditClick(post)}
                        type="button"
                        className="px-2.5 py-1 text-xs border border-white/10 hover:bg-white/5 text-white/80 rounded-lg transition-colors cursor-pointer"
                      >
                        {t.blog.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        type="button"
                        className="px-2.5 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                      >
                        {t.blog.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
