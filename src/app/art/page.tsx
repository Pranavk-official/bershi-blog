import { Metadata } from "next";

import { pageMeta } from "@lib/seo";
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

export default function ArtPage() {
  return (
    <section className="px-4 pt-10 sm:px-8 sm:pt-12" aria-labelledby="art-heading">
      <h1 id="art-heading" className="sr-only">
        Art
      </h1>
      <ArtBook />
    </section>
  );
}
