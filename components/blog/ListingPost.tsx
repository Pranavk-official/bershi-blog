import Link from "next/link";
import {
  topography,
  bamboo,
  leaf,
  wiggle,
  glamorous,
  moroccan,
  overlappingCircles,
  jigsaw,
} from "hero-patterns";

import type { PostMetadata } from "@lib/notion";
import { Badge } from "@components/ui/badge";
import { Squiggle } from "@components/shared/Doodles";
import { cn } from "@lib/utils";

// Notion posts carry no cover image, so each entry gets an SVG art panel
// instead — cycled by index so a listing never repeats back to back.
const art = [
  topography,
  bamboo,
  leaf,
  wiggle,
  glamorous,
  moroccan,
  overlappingCircles,
  jigsaw,
];

// Four scrapbook mounts, cycled: polaroid on graph paper, taped print,
// torn scrap, print over a sticky note.
const mounts = [
  { frame: "graph p-2 pb-5 shadow-md -rotate-2", panel: "bg-ash-100" },
  { frame: "tape bg-white p-2 shadow-md rotate-1 dark:bg-ash-200", panel: "bg-sage" },
  { frame: "torn bg-ash-50 p-5 -rotate-1 dark:bg-ash-200", panel: "bg-transparent" },
  {
    frame: "bg-white p-2 shadow-md rotate-2 dark:bg-ash-200",
    panel: "bg-blush",
    under: "-top-2 -left-3 h-[90%] w-2/5 -rotate-3 bg-sticky",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ListingPost({
  post,
  index = 0,
  isNew = false,
}: {
  post: PostMetadata;
  index?: number;
  isNew?: boolean;
}) {
  const href = `/blog/${post.slug}`;
  const mount = mounts[index % mounts.length];

  return (
    <article className="relative">
      {"under" in mount && (
        <span aria-hidden="true" className={cn("absolute", mount.under)} />
      )}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("relative block transition-transform hover:rotate-0", mount.frame)}
      >
        <span
          className={cn("block aspect-[4/3] w-full", mount.panel)}
          style={{ backgroundImage: art[index % art.length]("#23201b", 0.18) }}
        />
        {isNew ? (
          <Badge className="absolute -top-2 -right-2 rotate-3 bg-blush text-foreground">New</Badge>
        ) : (
          post.tags[0] && (
            <Badge className="absolute top-3 left-3 -rotate-3">{post.tags[0]}</Badge>
          )
        )}
      </Link>

      <h3 className="mt-5 text-xl leading-snug">
        <Link href={href} className="text-foreground transition-colors hover:text-primary">
          {post.title}
        </Link>
      </h3>
      <time dateTime={post.date} className="mt-1 block text-xs text-muted-foreground">
        {formatDate(post.date)}
      </time>
      <Squiggle className="mt-1 w-12" />
    </article>
  );
}
