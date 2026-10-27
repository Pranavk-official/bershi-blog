# Copilot Instructions for Portfolio Project

## Project Overview

Next.js 16 + React 19 portfolio site with Notion-powered blog, animated UI (Magic UI / shadcn registries), and section-based homepage. Stack: TypeScript, Tailwind CSS 4, Motion (`motion/react`), Three.js, Zod. Package manager: **bun**.

## Architecture

### Directory Layout & Path Aliases (always use these)

| Alias           | Path             | Purpose                           |
| --------------- | ---------------- | --------------------------------- |
| `@/`            | `./`             | Root                              |
| `@app/*`        | `src/app/*`      | Next.js routes                    |
| `@components/*` | `components/*`   | UI & shared components            |
| `@sections/*`   | `src/sections/*` | Homepage sections                 |
| `@lib/*`        | `lib/*`          | Utilities, Notion client, schemas |
| `@config/*`     | `src/config/*`   | Site config, holidays             |
| `@public/*`     | `public/*`       | Static assets                     |

**Note:** `config/site.ts` AND `src/config/site.ts` both exist with identical content — keep them in sync when editing site metadata.

### Section System (Homepage)

Each section lives in `src/sections/[name]/[Name]Section.tsx` with `"use client"`. Config data goes in `src/sections/[name]/config/`. All sections are re-exported through `src/sections/index.tsx`, where some are wrapped in `BlurFade` for scroll animations.

```tsx
// src/sections/index.tsx pattern
const Experience = () => (
  <BlurFade delay={0.25 * 2} inView direction="up">
    <ExperienceSection />
  </BlurFade>
);
```

Common section conventions:

- `<section>` wrapper with `aria-labelledby` + heading `id` for accessibility
- Gradient text: `bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent`
- `ScrollElement` for viewport-triggered heading animations
- Commented-out sections in `src/app/page.tsx` (AboutMe, Achievements) are pending rework

### Client vs Server Boundary

- **Client** (`"use client"`): All sections, animated components, NavDock, theme toggle, AnnouncementBar
- **Server**: Blog pages (ISR), `layout.tsx` (metadata + data fetching), `page.tsx` (homepage)
- Rule: `"use client"` required for anything using `motion/react` or React hooks

## UI Component System

Three external registries in `components.json`:

- `@magicui` — animated components (BlurFade, MagicCard, TextAnimate, etc.)
- `@react-bits` — React patterns
- `@uilayouts` — layout components

Add components: `bun run shadcn add @magicui/blur-fade`

**Animation library**: Always use `motion` from `motion/react` (NOT `framer-motion`).

## Blog System (Notion-Powered)

`lib/notion.ts` fetches all content from Notion API. **Not markdown files.**

Key functions:

- `getAllPublished()` → published posts sorted by date
- `getFilteredPosts(page, pageSize, search, tag)` → in-memory filtering (fetches all posts each call)
- `getSinglePost(slug)` → full post with markdown via `notion-to-md`
- `getAllTags()` → unique sorted tags

All functions gracefully return empty/null when `NOTION_TOKEN` or `NOTION_DATA_SOURCE_ID` env vars are missing. Never throws.

ISR revalidation: `/blog` = 60s, `/blog/[slug]` = 600s, root layout = 60s.

Required env vars:

```env
NOTION_TOKEN=secret_xxx
NOTION_DATA_SOURCE_ID=database_id_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Styling

- **Tailwind CSS 4** with `oklch()` color space and `@custom-variant dark (&:is(.dark *))` for dark mode
- Blog has separate "Ember & Ash" palette using `--color-*` CSS custom properties alongside the shadcn `--background/--foreground` vars
- Fonts: `Geist` (base), `Crimson_Pro` (blog headings), `JetBrains_Mono` (code), `Outfit` (UI elements)
- Theme: manual `localStorage` persistence with inline `<script>` in layout.tsx to prevent FOUC (no next-themes for toggling — uses View Transitions API)

## Holiday & Seasonal System

Two independent systems:

1. **Snow overlay** (`layout.tsx`): `isChristmasSeason()` from `lib/utils/dateHelpers.ts` uses date ranges from `lib/constants.ts` (Dec 1–25)
2. **AnnouncementBar holidays** (`useHoliday` hook): reads `src/config/holidays.json` for Christmas, New Year, Halloween, Valentine's Day. Supports `?testDate=YYYY-MM-DD` in dev mode. Lazy-loads Fireworks/Snow via `next/dynamic`.

Feature flags in `lib/constants.ts`: `FEATURES.ENABLE_SNOW`, `FEATURES.RESPECT_REDUCED_MOTION`, `FEATURES.DEBUG_MODE`.

## Validation Patterns

- **User input** (contact form): Zod schemas in `lib/schemas/contactSchema.ts`
- **Config data** (experience entries): imperative validation in `src/sections/experience/utils/validation.ts` with dev-only `console.warn` for filtered entries

## Development

```bash
bun run dev    # Turbopack dev server
bun run build  # NODE_OPTIONS=--max-old-space-size=8192 (Three.js needs extra memory)
bun run lint   # ESLint
```

Build requires Notion credentials for static generation; without them, blog pages are skipped gracefully.

### Adding a New Section

1. Create `src/sections/name/NameSection.tsx` (`"use client"`, default export)
2. Add BlurFade wrapper + re-export in `src/sections/index.tsx`
3. Import and render in `src/app/page.tsx`

### Adding Animated Components

```tsx
"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
// Always extend HTMLAttributes for className/style passthrough
```

### Navigation

`NavDock` (`components/shared/NavDock.tsx`) reads from `src/sections/config/dockItems.ts`. Items support `showOnlyWhenNotHome`, `external`, and separator entries. Dock auto-hides near footer.

### Remote Images

Allowed hostnames in `next.config.ts`: `images.unsplash.com`, `ui-avatars.com`. Add new hostnames there before using `next/image` with external URLs.
