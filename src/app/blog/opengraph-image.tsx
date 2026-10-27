import { siteConfig } from "@/config/site";
import { ogCard, ogSize } from "../_og/card";

export const alt = `Notes — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    title: "Notes",
    subtitle: "On code, craft and the web, by Pranav K.",
    print: { src: "profile_.png" },
    list: { heading: "On here:", items: ["Notes", "Art", "About"], active: "Notes" },
  });
}
