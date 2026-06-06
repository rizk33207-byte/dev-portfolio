import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(500),
  longDesc: z.string().max(5000).optional(),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  techStack: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  githubUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")).nullable(),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  category: z.enum(["fullstack", "frontend", "backend"]),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

export const projectUpdateSchema = projectSchema.partial();

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  coverImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  readTime: z.number().int().min(1).max(60).optional().default(5),
  published: z.boolean().optional().default(false),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

export const analyticsSchema = z.object({
  page: z.string().min(1).max(500),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
export type AnalyticsInput = z.infer<typeof analyticsSchema>;
