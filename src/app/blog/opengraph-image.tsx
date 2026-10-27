import { siteConfig } from "@/config/site";
import { ogCard, ogSize } from "../_og/card";

export const alt = `Notes — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: siteConfig.name,
    title: "Notes",
    subtitle: "On code, craft and the web.",
    print: { src: "profile_.png" },
  });
}
