import { getPostMetadataBySlug, type PostMetadata } from "@/lib/notion";
import { siteConfig } from "@/config/site";
import { ogCard, ogSize } from "../../_og/card";

export const alt = "Blog Post";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: PostMetadata | null = null;
  try {
    post = await getPostMetadataBySlug(slug);
  } catch (error) {
    console.error("Error fetching post metadata for OG image:", error);
  }

  if (!post) return ogCard({ kicker: siteConfig.name, title: "Notes" });

  return ogCard({
    kicker: post.tags?.length ? post.tags.map((t) => `#${t}`).join("  ") : `Notes — ${siteConfig.name}`,
    title: post.title,
    subtitle: post.description,
  });
}
