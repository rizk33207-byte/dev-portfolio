import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.user.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.pageView.deleteMany({});
  await prisma.cvDownload.deleteMany({});

  console.log("Seeding user...");
  const hashedPassword = await hash("Admin123!", 10);
  await prisma.user.create({
    data: {
      email: "admin@mahmoud.dev",
      name: "Mahmoud Rizk",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Seeding projects...");
  await prisma.project.createMany({
    data: [
      {
        title: "E-Commerce Cloud Platform",
        description: "A full-scale headless e-commerce backend built with Next.js, Stripe, and PostgreSQL.",
        longDesc: "A complete multi-tenant platform featuring custom storefront configuration, automated inventory alerts, Stripe payment intent routing, and real-time sales dashboards with dynamic charting.",
        thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=600",
        techStack: JSON.stringify(["Next.js", "React", "PostgreSQL", "Prisma", "Stripe", "TailwindCSS"]),
        githubUrl: "https://github.com/mahmoudrizk/ecommerce-cloud",
        liveUrl: "https://ecommerce-demo.mahmoud.dev",
        category: "fullstack",
        featured: true,
        order: 1,
      },
      {
        title: "Developer Portfolio Website",
        description: "Modern, dynamic personal portfolio built with Next.js 15, Prisma ORM, and SQLite database.",
        longDesc: "A premium personal portfolio with a custom CMS admin panel, real-time analytics dashboard, contact message storage, email notifications via Nodemailer, and page-view/download trackers.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600",
        techStack: JSON.stringify(["Next.js", "TypeScript", "Prisma", "SQLite", "Nodemailer", "TailwindCSS"]),
        githubUrl: "https://github.com/mahmoudrizk/next-portfolio",
        liveUrl: "https://mahmoud.dev",
        category: "fullstack",
        featured: true,
        order: 2,
      },
      {
        title: "AI Image Generation Canvas",
        description: "Interactive UI dashboard using Stable Diffusion API to generate, edit, and upscale assets.",
        longDesc: "An AI-powered design application featuring real-time image creation, prompt enhancements, canvas layer management, background removal, and persistent user gallery folders.",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
        techStack: JSON.stringify(["React", "Vite", "Node.js", "Express", "OpenAI API", "Framer Motion"]),
        githubUrl: "https://github.com/mahmoudrizk/ai-canvas",
        liveUrl: "https://ai-canvas.mahmoud.dev",
        category: "frontend",
        featured: true,
        order: 3,
      },
      {
        title: "Task Orchestrator & CLI Tool",
        description: "High-performance Node CLI and workflow visualizer built to manage complex monorepos.",
        longDesc: "A developer tool designed to run parallel tasks, manage workspace dependencies, resolve cyclic references, and log multi-threaded output in a beautiful interactive console interface.",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600",
        techStack: JSON.stringify(["Node.js", "TypeScript", "Commander", "Chalk", "Inquirer", "RxJS"]),
        githubUrl: "https://github.com/mahmoudrizk/task-orchestrator",
        liveUrl: null,
        category: "backend",
        featured: false,
        order: 4,
      },
    ],
  });

  console.log("Seeding blog posts...");
  await prisma.blogPost.createMany({
    data: [
      {
        title: "Navigating Server Components in Next.js 15",
        slug: "navigating-server-components-nextjs-15",
        excerpt: "An in-depth guide on optimizing Server vs Client Components, handling dynamic data, and avoiding waterfalls.",
        content: `Next.js 15 brings refined patterns for React Server Components (RSC). Understanding when to fetch data on the server versus capturing state on the client is key to building fast, SEO-friendly applications.

## Why Server Components?
By default, Next.js page components are Server Components. They execute solely on the server, producing static HTML that requires zero JavaScript on the client to render first-paint layouts. This drastically reduces the JavaScript bundle size sent to users.

### Key Benefits:
1. **Performance**: Zero client bundle footprint for layout elements.
2. **Security**: Keep API keys, DB queries, and heavy parsing logic away from the browser.
3. **Data Fetching**: Colocated database queries and network calls result in fewer round-trips.

## Best Practices
Always fetch data at the page or layout level and pass it down as props. For user interactivity (such as forms, menus, and buttons), abstract them into client files annotated with the \`"use client"\` directive. Keep the client boundary as low in the component tree as possible.`,
        coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600",
        category: "Next.js",
        readTime: 6,
        published: true,
        publishedAt: new Date(),
      },
      {
        title: "Why Prisma is the Ideal ORM for SQLite and Next.js",
        slug: "why-prisma-ideal-orm-sqlite-nextjs",
        excerpt: "Learn how type safety, auto-migrations, and relation modeling speed up fullstack prototyping.",
        content: `When building serverless web apps or small-to-medium client portfolios, SQLite and Prisma form an incredibly robust development environment.

## 1. Zero-Config Databases
Unlike setting up Docker containers or subscribing to external Postgres providers, SQLite is a local file. Combined with Prisma, your schema is localized in code and your database is stored within your repository (e.g. \`./prisma/portfolio.db\`).

## 2. Strong Type Safety
Prisma generates TypeScript interfaces directly from your \`schema.prisma\`. This means auto-complete is active for all database queries. If you modify a field name, your TypeScript compiler will flag every single file requiring updates immediately.

## 3. Database Seeders
With \`tsx\` and Prisma client, seeding a database with mock analytics, mock messages, and portfolio items takes seconds. It creates a reproducible development flow across team members.`,
        coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600",
        category: "Databases",
        readTime: 4,
        published: true,
        publishedAt: new Date(),
      },
      {
        title: "Designing Interactive Glassmorphism Dashboards",
        slug: "designing-interactive-glassmorphism-dashboards",
        excerpt: "Drafting a premium UI using CSS backdrop filters, smooth gradients, and custom responsive layouts.",
        content: `Dashboard aesthetics are critical. A clean, premium dashboard built with glassmorphic cards, harmonized CSS variables, and subtle border highlights makes content updates feel delightful.

### The Glassmorphism Recipe:
1. **Background**: Low-contrast dark tone (e.g., \`#0A0A0F\`) with subtle blur blobs behind the container.
2. **Backdrop Filter**: \`backdrop-filter: blur(12px) saturate(190%)\`.
3. **Border**: Thin border with highly translucent white: \`border: 1px solid rgba(255, 255, 255, 0.08)\`.
4. **Card Fill**: Semi-transparent dark overlay: \`background: rgba(255, 255, 255, 0.03)\`.

Apply these rules consistently across cards, sidebar panels, input fields, and hover states to create a cohesive layout.`,
        coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
        category: "Design",
        readTime: 5,
        published: false,
      },
    ],
  });

  console.log("Seeding contact messages...");
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Sarah Jenkins",
        email: "sarah@recruiters.com",
        subject: "Freelance Project Opportunity",
        message: "Hi Mahmoud, I came across your portfolio and love your fullstack projects. We are looking for a Next.js contractor for a 3-month project. Let's hop on a call!",
        read: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h ago
      },
      {
        name: "David Miller",
        email: "d.miller@techsolutions.io",
        subject: "Your AI Image Generation Canvas App",
        message: "Hello Mahmoud! I played with your AI Image Canvas app. Did you use custom APIs or wrap replicate/openai? Would love to collaborate on a similar feature for my startup.",
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ],
  });

  console.log("Seeding page views...");
  const views = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    // Add random number of views for each day
    const dayCount = Math.floor(Math.random() * 25) + 5;
    for (let j = 0; j < dayCount; j++) {
      views.push({
        page: Math.random() > 0.3 ? "/" : Math.random() > 0.5 ? "/blog" : "/#projects",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        country: "EG",
        createdAt: new Date(date.getTime() - Math.random() * 8 * 60 * 60 * 1000),
      });
    }
  }
  await prisma.pageView.createMany({ data: views });

  console.log("Seeding CV downloads...");
  await prisma.cvDownload.createMany({
    data: [
      { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { userAgent: "Mozilla/5.0 (Windows NT 10.0)", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { userAgent: "Mozilla/5.0 (Linux; Android 10)", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    ],
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
