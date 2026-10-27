import { siteConfig } from "@/config/site";
import { ogCard, ogSize } from "./_og/card";

export const alt = siteConfig.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    // No-break space keeps the name on one line.
    title: `Hi, I'm ${siteConfig.name.replace(/ /g, "\u00a0")}.`,
    subtitle: siteConfig.tagline,
    print: { src: "profile_.png" },
  });
}
