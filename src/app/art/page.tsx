import { Metadata } from "next";

import { pageMeta } from "@lib/seo";
import { visibleWallpapers } from "@lib/hidden-art";
import { ArtBook } from "./art-client";

const title = "Art";
const description =
  "Original artwork by Pranav K — desktop and mobile wallpapers, free to download for personal use.";

export const metadata: Metadata = {
  ...pageMeta({ title, description, path: "/art", image: "/art/opengraph-image" }),
  keywords: [
    "art",
    "original artwork",
    "wallpapers",
    "desktop wallpapers",
    "mobile wallpapers",
    "free wallpapers",
    "Pranav K art",
  ],
};

export default async function ArtPage() {
  const wallpapers = await visibleWallpapers();
  return (
    <section className="px-4 pt-10 sm:px-8 sm:pt-12" aria-labelledby="art-heading">
      <h1 id="art-heading" className="sr-only">
        Art
      </h1>
      {wallpapers.length ? (
        <ArtBook wallpapers={wallpapers} />
      ) : (
        <p className="py-24 text-center font-hand text-2xl text-muted-foreground">New pages are on their way.</p>
      )}
    </section>
  );
}
