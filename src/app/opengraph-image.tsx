import { siteConfig } from "@/config/site";
import { ogCard, ogSize } from "./_og/card";

export const alt = siteConfig.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    title: `Hi, I'm\n${siteConfig.name}.`,
    subtitle: siteConfig.tagline,
    print: { src: "profile_.png" },
    list: { heading: "On here:", items: ["Notes", "Art", "About"] },
  });
}
