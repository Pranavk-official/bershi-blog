import { siteConfig } from "@/config/site";
import { ogCard, ogSize } from "../_og/card";

export const alt = `Art — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: siteConfig.name,
    title: "Art",
    subtitle: "Original artwork. Desktop and mobile wallpapers, free for personal use.",
    print: { src: "wallpapers/16x9/Goblin_16x9_1.png", wide: true, zoom: 2.2 },
  });
}
