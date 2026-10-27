import { Metadata } from "next";

import { siteConfig } from "@config/site";
import { ArtBook } from "./art-client";

const title = "Art";
const description =
  "Original artwork by Pranav K — desktop and mobile wallpapers, free to download for personal use.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "art",
    "original artwork",
    "wallpapers",
    "desktop wallpapers",
    "mobile wallpapers",
    "free wallpapers",
    "Pranav K art",
  ],
  alternates: { canonical: "/art" },
  openGraph: {
    title,
    description,
    type: "website",
    url: `${siteConfig.url}/art`,
    siteName: siteConfig.name,
    locale: "en_US",
  },
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
