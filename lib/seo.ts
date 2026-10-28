import type { Metadata } from "next";

import { siteConfig } from "@config/site";

/**
 * Title, description, canonical URL and matching share tags for one page.
 * Next.js doesn't merge `openGraph` / `twitter` with the parent's, so a page
 * that sets only a title still shares with its parent's title and URL; use
 * this on every page instead.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  /** Page name; the layout's template adds " | Pranav K". Omit for the site title. */
  title?: string;
  description: string;
  /** Path from the site root, e.g. "/notes". */
  path: string;
  /** Share card. Setting share tags here drops the parent's, so it is always explicit. */
  image?: string;
}): Metadata {
  const shareTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;

  return {
    title: title ?? { absolute: siteConfig.title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      url: path,
      title: shareTitle,
      description,
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@Arch_Lad_",
      title: shareTitle,
      description,
      images: image,
    },
  };
}

/** The site's owner, for JSON-LD. */
export const person = {
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Full Stack Developer",
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.twitter.replace("/@", "/")],
};
