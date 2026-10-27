# Pranav K — Personal Portfolio

A modern, performant personal portfolio built with **Next.js 16**, **React 19**, and **TypeScript**. Features animated UI components, a Notion-powered blog, 3D graphics, and full SEO support.

🌐 **Live site:** [pranavk.site](https://pranavk.site)

---

## Features

- **Multi-section single page** — Hero, Skills, Projects, Experience, Achievements, Contact, and Footer
- **Notion-powered blog** — Posts are fetched from a Notion database, with search, tag-filtering, and pagination
- **Dedicated pages** — `/blog`, `/blog/[slug]`, `/projects`, `/projects/[slug]`, `/achievements/[slug]`
- **Dark / Light mode** — Flicker-free theme toggle with localStorage persistence
- **3D animations** — Three.js (`@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`) scenes in the hero
- **Smooth animations** — GSAP and Motion (Framer Motion v12) for scroll-driven and entrance animations
- **Particle effects** — tsParticles integration
- **Announcement bar** — Surfaces the latest blog post (published within the past 7 days) automatically
- **Christmas easter egg** — Snow animation that appears only during the Christmas season
- **Full SEO** — Dynamic `<metadata>`, Open Graph images, Twitter cards, sitemap, and `site.webmanifest`
- **Content Security Policy** — Configurable CSP headers per-route via `next.config.ts`

---

## Tech Stack

| Category | Libraries / Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui (New York style), tw-animate-css |
| Animation | GSAP 3, Motion 12 (Framer Motion), rough-notation |
| 3D | Three.js, @react-three/fiber, @react-three/drei, @react-three/rapier |
| Particles | @tsparticles/react, @tsparticles/slim |
| Blog CMS | Notion API (`@notionhq/client`), notion-to-md |
| Forms | react-hook-form, Zod |
| Icons | Lucide React, Radix UI Icons, react-icons |
| Fonts | Geist, Geist Mono, Crimson Pro, JetBrains Mono, Outfit (via `next/font`) |
| Package Manager | Bun |

---

## Project Structure

```
portfolio-next/
├── config/
│   └── site.ts              # Central site metadata (name, URL, links, keywords)
├── lib/
│   ├── notion.ts            # Notion API client & helpers (fetch posts, filter, paginate)
│   ├── markdownToHtml.ts    # remark/rehype markdown pipeline
│   ├── utils.ts             # cn() and shared utilities
│   ├── schemas/             # Zod validation schemas
│   └── utils/               # dateHelpers, etc.
├── components/
│   ├── ui/                  # shadcn/ui + custom primitives
│   ├── shared/              # NavDock, AnnouncementBar, Lanyard badge
│   ├── hero/                # Hero-specific interactive components
│   ├── blog/                # Blog card, reader, syntax highlighting
│   └── uilayouts/           # Layout wrappers (magic-ui, ui-layouts)
├── src/
│   ├── app/
│   │   ├── page.tsx         # Home page (assembles all sections)
│   │   ├── layout.tsx       # Root layout (fonts, theme, NavDock, SnowFX)
│   │   ├── blog/            # /blog list page + /blog/[slug] detail page
│   │   ├── projects/        # /projects list + /projects/[slug]
│   │   ├── achievements/    # /achievements/[slug]
│   │   ├── sitemap.ts       # Auto-generated sitemap
│   │   └── opengraph-image.tsx  # Dynamic OG image generation
│   ├── sections/            # Page sections (Hero, Skills, Projects, Experience, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── interfaces/          # Shared TypeScript interfaces
│   └── assets/              # Static assets referenced in source
├── public/                  # favicon, OG image, site.webmanifest, robots.txt
├── next.config.ts           # Next.js config (CSP headers, image remote patterns)
└── components.json          # shadcn/ui configuration
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0 (recommended) **or** Node.js ≥ 20
- A [Notion](https://notion.so) account with an integration token (for blog functionality)

### 1. Clone & Install

```bash
git clone https://github.com/Pranavk-official/portfolio-next.git
cd portfolio-next
bun install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Site URL — used for metadata, OG images, and sitemaps
# Set to http://localhost:3000 during development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Notion API — required for blog posts to appear
NOTION_TOKEN=your_notion_integration_token
NOTION_DATA_SOURCE_ID=your_notion_database_id
```

> **Note:** If `NOTION_TOKEN` or `NOTION_DATA_SOURCE_ID` are missing, the blog will gracefully return an empty list rather than crashing.

#### Setting up the Notion Database

Your Notion database needs the following properties:

| Property | Type | Description |
|---|---|---|
| `Title` | Title | Post title |
| `Slug` | Rich Text | URL-friendly slug (e.g. `my-first-post`) |
| `Date` | Date | Publication date |
| `Tags` | Multi-select | Post tags |
| `Description` | Rich Text | Short excerpt shown in cards |
| `Published` | Checkbox | Only checked posts appear on the site |

### 3. Run the Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Build for Production

```bash
bun run build
bun start
```

The build script sets `NODE_OPTIONS=--max-old-space-size=8192` to handle large dependency graphs during SSR.

---

## Deployment

### Vercel (Recommended)

1. Import the repository on [Vercel](https://vercel.com/new).
2. Add the following environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` — your production domain (e.g. `https://pranavk.site`)
   - `NOTION_TOKEN` — your Notion integration secret
   - `NOTION_DATA_SOURCE_ID` — your Notion database ID
3. Deploy — Vercel handles the rest automatically.

The root layout uses `export const revalidate = 60`, so blog posts and announcement bar content refresh every 60 seconds via ISR without requiring a full redeploy.

---

## Customisation

All personal data (name, bio, social links, keywords) lives in [`config/site.ts`](./config/site.ts).  
Section-level content (projects, skills, experience, achievements) is managed in the individual section directories under `src/sections/`.
