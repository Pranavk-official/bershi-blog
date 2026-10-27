import { siteConfig } from "@/config/site";
import { ogCard, ogSize } from "../_og/card";

export const alt = `Art — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    title: "Art",
    subtitle: "Original artwork and free wallpapers by Pranav K.",
    print: { src: "wallpapers/16x9/Goblin_16x9_1.png", wide: true, zoom: 2.2 },
  });
}
