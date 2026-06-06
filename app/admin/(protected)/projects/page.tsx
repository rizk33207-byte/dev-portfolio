"use client";

import { useState, useEffect } from "react";
import MediaUploader from "@/components/admin/MediaUploader";
import { useI18n } from "@/lib/admin-i18n";

interface Project {
  id: string;
  title: string;
  description: string;
  longDesc?: string;
  thumbnail?: string;
  videoUrl?: string | null;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: "fullstack" | "frontend" | "backend";
  featured: boolean;
  order: number;
}

export default function ProjectsPage() {
  const { t, isRTL } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [techStackInput, setTechStackInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [category, setCategory] = useState<"fullstack" | "frontend" | "backend">("fullstack");
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.success) {
        setProjects(json.data);
      } else {
        setError(json.error || t.common.error);
      }
    } catch (err) {
      setError(isRTL ? "حدث خطأ أثناء جلب المشاريع." : "An error occurred while fetching projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setLongDesc(project.longDesc || "");
    setThumbnail(project.thumbnail || "");
    setVideoUrl(project.videoUrl || null);
    setTechStackInput(project.techStack.join(", "));
    setGithubUrl(project.githubUrl || "");
    setLiveUrl(project.liveUrl || "");
    setCategory(project.category);
    setFeatured(project.featured);
    setOrder(project.order);
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
    setDescription("");
    setLongDesc("");
    setThumbnail("");
    setVideoUrl(null);
    setTechStackInput("");
    setGithubUrl("");
    setLiveUrl("");
    setCategory("fullstack");
    setFeatured(false);
    setOrder(0);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    // Parse tech stack input
    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      description,
      longDesc: longDesc || undefined,
      thumbnail: thumbnail || undefined,
      videoUrl: videoUrl || undefined,
      techStack,
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
      category,
      featured,
      order: Number(order),
    };

    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
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
        fetchProjects();
      } else if (res.status === 400 && json.error) {
        setFormErrors(json.error);
      } else {
        alert(json.error || (isRTL ? "حدث خطأ أثناء حفظ المشروع." : "An error occurred while saving the project."));
      }
    } catch (err) {
      alert(t.common.error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? "هل أنت متأكد من حذف هذا المشروع؟" : "Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        fetchProjects();
      } else {
        alert(json.error || (isRTL ? "فشل حذف المشروع." : "Failed to delete project"));
      }
    } catch (err) {
      alert(isRTL ? "حدث خطأ أثناء حذف المشروع." : "An error occurred while deleting the project.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">{t.projects.title}</h1>
          <p className="text-white/50 text-sm mt-1">{t.projects.subtitle}</p>
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
            + {t.projects.addProject}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-lg font-semibold mb-4 text-white">
            {editingId ? t.projects.editProject : t.projects.addProject}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.title_field}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Next E-Commerce"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.title && <p className="text-red-400 text-xs mt-1">{formErrors.title[0]}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="fullstack">{t.projects.fullstack}</option>
                  <option value="frontend">{t.projects.frontend}</option>
                  <option value="backend">{t.projects.backend}</option>
                </select>
                {formErrors.category && <p className="text-red-400 text-xs mt-1">{formErrors.category[0]}</p>}
              </div>

              {/* Thumbnail */}
              <div>
                <MediaUploader
                  endpoint="projectThumbnail"
                  value={thumbnail || null}
                  onChange={(url) => setThumbnail(url)}
                  accept="image"
                  label={t.projects.thumbnail}
                />
                {formErrors.thumbnail && <p className="text-red-400 text-xs mt-1">{formErrors.thumbnail[0]}</p>}
              </div>

              {/* Demo Video */}
              <div>
                <MediaUploader
                  endpoint="projectVideo"
                  value={videoUrl}
                  onChange={(url) => setVideoUrl(url)}
                  accept="video"
                  label={t.projects.video}
                />
                {formErrors.videoUrl && <p className="text-red-400 text-xs mt-1">{formErrors.videoUrl[0]}</p>}
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.techStack}</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="React, Next.js, TypeScript"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.techStack && <p className="text-red-400 text-xs mt-1">{formErrors.techStack[0]}</p>}
              </div>

              {/* Github URL */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.githubUrl}</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="e.g. https://github.com/..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.githubUrl && <p className="text-red-400 text-xs mt-1">{formErrors.githubUrl[0]}</p>}
              </div>

              {/* Live URL */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.liveUrl}</label>
                <input
                  type="text"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="e.g. https://demo.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.liveUrl && <p className="text-red-400 text-xs mt-1">{formErrors.liveUrl[0]}</p>}
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.order}</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
                {formErrors.order && <p className="text-red-400 text-xs mt-1">{formErrors.order[0]}</p>}
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3 mt-5">
                <input
                  id="featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-0"
                />
                <label htmlFor="featured" className="text-sm font-medium text-white/70">
                  {t.projects.featured}
                </label>
                {formErrors.featured && <p className="text-red-400 text-xs mt-1">{formErrors.featured[0]}</p>}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.shortDesc}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                placeholder="Brief summary of the project..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 resize-y"
              />
              {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description[0]}</p>}
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">{t.projects.longDesc}</label>
              <textarea
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                rows={4}
                placeholder="In-depth explanation..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 resize-y"
              />
              {formErrors.longDesc && <p className="text-red-400 text-xs mt-1">{formErrors.longDesc[0]}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-white/10 rounded-lg text-white/80 hover:bg-white/5 text-sm font-medium transition-colors cursor-pointer"
              >
                {t.projects.cancel}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-60 transition-colors cursor-pointer"
              >
                {submitting ? (isRTL ? "جاري الحفظ..." : "Saving...") : t.projects.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="text-white/50 text-sm">{t.common.loading}</div>
      ) : error ? (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-white/40 text-center py-10 bg-white/5 rounded-2xl border border-white/10">
          {t.projects.noProjects}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur">
          <div className="overflow-x-auto">
            <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse text-sm`}>
              <thead>
                <tr className="border-b border-white/10 text-white/50 font-medium bg-surface/50">
                  <th className="p-4">{isRTL ? "الترتيب" : "Order"}</th>
                  <th className="p-4">{isRTL ? "المشروع" : "Project"}</th>
                  <th className="p-4">{t.projects.category}</th>
                  <th className="p-4">{t.projects.techStack}</th>
                  <th className="p-4 text-center">{isRTL ? "مميز" : "Featured"}</th>
                  <th className={`p-4 ${isRTL ? "text-left" : "text-right"}`}>{isRTL ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4 text-white/40 font-mono">{project.order}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{project.title}</div>
                      <div className="text-xs text-white/50 max-w-xs truncate">{project.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white capitalize">
                        {project.category === "fullstack"
                          ? t.projects.fullstack
                          : project.category === "frontend"
                          ? t.projects.frontend
                          : t.projects.backend}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {project.featured ? <span className="text-yellow-400 text-lg">★</span> : <span className="text-white/20">—</span>}
                    </td>
                    <td className={`p-4 ${isRTL ? "text-left" : "text-right"} space-x-2`}>
                      <button
                        onClick={() => handleEditClick(project)}
                        type="button"
                        className="px-2.5 py-1 text-xs border border-white/10 hover:bg-white/5 text-white/80 rounded-lg transition-colors cursor-pointer"
                      >
                        {t.projects.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        type="button"
                        className="px-2.5 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                      >
                        {t.projects.delete}
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
