# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun**.

```bash
bun install        # Install deps
bun run dev        # Next.js dev server
bun run build      # NODE_OPTIONS=--max-old-space-size=8192 next build (Three.js needs the extra heap)
bun start          # Serve production build
bun run lint       # ESLint (eslint.config.mjs, extends next/core-web-vitals + next/typescript)
```

No test framework is installed; `bun test` runs the few `*.test.ts` files that exist (currently `lib/contactGuards.test.ts`). `**/*.test.ts` is excluded from `tsconfig.json` so `bun:test` imports don't need `@types/bun`.

Add a shadcn-style component from a registry:

```bash
bun run shadcn add @magicui/blur-fade
```

Registries declared in `components.json`: `@magicui`, `@react-bits`, `@uilayouts`.

## Environment

Required for Notion-backed blog and absolute URLs:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NOTION_TOKEN=secret_xxx
NOTION_DATA_SOURCE_ID=database_id
HOSTINGER_MAIL_TOKEN=bearer_token
HOSTINGER_MAILBOX_ID=mailbox_resource_id
ADMIN_PASSWORD=long_random_string      # /admin sign-in; also the cookie signing key
GITHUB_TOKEN=github_pat_xxx            # fine-grained, Contents: read & write on this repo
GITHUB_REPO=Pranavk-official/bershi-blog
GITHUB_BRANCH=main                     # optional
```

`/admin` (art uploads) lives in `src/app/admin/`. Auth is `lib/admin-auth.ts` (signed httpOnly cookie, checked in the page and in `src/app/api/admin/art/route.ts`); no `ADMIN_PASSWORD` means nobody can sign in. Publishing commits the image to `public/wallpapers/<aspect>/` and the updated `src/sections/wallpapers/config/wallpapers.json` as one commit via `lib/github-commit.ts`, so new art appears after Vercel redeploys. The editor (`art-editor.tsx`) is fabric + perfect-freehand, adapted from delphitools' substrata; uploads must stay under Vercel's 4.5 MB body limit.

When `NEXT_PUBLIC_SITE_URL` is unset, `getBaseUrl()` falls back to the production domain `https://bershi-blog.vercel.app` (hardcoded in both `config/site.ts` and `src/config/site.ts`; `src/app/robots.ts` and `sitemap.ts` build their URLs from it). Per-page SEO goes through `pageMeta()` in `lib/seo.ts`, since a page that sets `openGraph`/`twitter` drops its parent's.

When `NOTION_TOKEN` / `NOTION_DATA_SOURCE_ID` are missing, `lib/notion.ts` silently returns empty results — pages render but the blog list is empty. Never throw on missing creds.

`HOSTINGER_MAIL_TOKEN` / `HOSTINGER_MAILBOX_ID` back `HostingerContactForm` (`src/app/api/contact/route.ts`, `hostinger-mail-api-sdk`). Missing creds → the route 500s; the form shows its error state. Recipient comes from `siteConfig.links.email`. The older `ContactForm` (Google Forms, no backend) is still in `components/shared/` but unused.

## Architecture

### Path aliases (always prefer over relative imports)

| Alias | Path |
|---|---|
| `@/*` | repo root |
| `@app/*` | `src/app/*` |
| `@components/*` | `components/*` (note: NOT `src/components`) |
| `@sections/*` | `src/sections/*` |
| `@lib/*` | `lib/*` |
| `@config/*` | `src/config/*` |
| `@public/*` | `public/*` |

`config/site.ts` and `src/config/site.ts` both exist with identical content — keep them in sync when editing site metadata.

### Section system (homepage)

The homepage in `src/app/page.tsx` is assembled from sections in `src/sections/<name>/<Name>Section.tsx`. Each section is `"use client"`, default-exports a component, and is re-exported through `src/sections/index.tsx` where most are wrapped in `BlurFade` for entrance animation:

```tsx
const Project = () => (
  <BlurFade delay={0.25 * 2} inView direction="up"><ProjectsSection /></BlurFade>
);
```

Section data (projects, experience, achievements, dock items) lives in `src/sections/<name>/config/*.ts`. To add a section: create the file, wrap + re-export in `src/sections/index.tsx`, render in `src/app/page.tsx`.

Section conventions: `<section id="…" aria-labelledby="…-heading">`, gradient heading via `bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent`, viewport-triggered animations via `ScrollElement` and `BlurFade`.

### Client/server boundary

- Server: `layout.tsx` (no data fetching), `page.tsx`, blog pages, `sitemap.ts`, `opengraph-image.tsx`.
- Client: all section components, `NavDock`, theme toggle, anything using `motion/react` or hooks.
- **Always import `motion` from `motion/react`, never `framer-motion`.**

### Blog (Notion-powered, not Markdown)

`lib/notion.ts` exposes `getAllPublished()`, `getFilteredPosts(page, pageSize, search, tag)` (in-memory filtering, refetches all posts each call), `getSinglePost(slug)` (uses `notion-to-md`), `getAllTags()`. ISR: `/notes` = 60s, `/notes/[slug]` = 600s (`/blog` and `/blog/*` 308-redirect here via `next.config.ts`), root layout = 60s.

Notion DB properties expected: `Title`, `Slug`, `Date`, `Tags`, `Description`, `Published`.

### Navigation dock

`components/shared/NavDock.tsx` reads `src/sections/config/dockItems.ts`. Items support `external`, `showOnlyWhenNotHome`, and a `separator` entry. The dock auto-hides near the `<footer>` on scroll. Anchor links like `/#projects` smooth-scroll on the home route and navigate-with-hash on other routes.

### Styling

- Tailwind CSS v4 with `oklch()` tokens and `@custom-variant dark (&:is(.dark *))`.
- Blog uses a separate "Ember & Ash" palette via `--color-*` custom properties alongside shadcn's `--background` / `--foreground`.
- Scrapbook look: `Courier_Prime` body (`font-sans`), `Patrick_Hand` headings (`font-hand`; `font-crimson` aliases it), `JetBrains_Mono` code. Paper grain on `body`; `tape` / `paper` utilities in `globals.css`; shadcn `Button`/`Card`/`Badge`/`Input` carry the ink-and-paper styling.
- Theme toggle is custom (View Transitions API + `localStorage`), **not** `next-themes`. An inline `<script>` in `layout.tsx` sets the `dark` class pre-hydration to prevent FOUC — don't replace it with a provider.

### Holiday / seasonal

Two independent systems:
1. `<Snow />` overlay in `layout.tsx`, gated by `isChristmasSeason()` (date range in `lib/constants.ts`, Dec 1–25).
2. `AnnouncementBar` via the `useHoliday` hook (`src/config/holidays.json`) — currently **not rendered** (removed from `layout.tsx`); files kept.

Feature flags in `lib/constants.ts`: `FEATURES.ENABLE_SNOW`, `FEATURES.RESPECT_REDUCED_MOTION`, `FEATURES.DEBUG_MODE`.

### Validation

- User input (contact form): Zod in `lib/schemas/contactSchema.ts`.
- Config data (experience entries): imperative validation in `src/sections/experience/utils/validation.ts` with dev-only `console.warn`.

### Remote images

`next.config.ts` whitelists `images.unsplash.com` and `ui-avatars.com`. Add new hostnames there before using `next/image` with external URLs.

### CSP

`next.config.ts` applies a per-route CSP only to `/achievements/:slug*`. New routes that need a custom CSP must be added to the `headers()` array.
