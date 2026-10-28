import { MetadataRoute } from "next";
import { siteConfig } from "@config/site";
import { getAllPublished } from "@/lib/notion";
import { achievements } from "@sections/achievements/config/achievements";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // Posts from Notion, only when credentials are available.
    let posts: Awaited<ReturnType<typeof getAllPublished>> = [];
    if (process.env.NOTION_TOKEN && process.env.NOTION_DATA_SOURCE_ID) {
        try {
            posts = await getAllPublished();
        } catch (error) {
            console.warn("Failed to fetch posts for sitemap:", error);
        }
    }

    // Real dates only: a "now" on every request teaches crawlers to ignore it.
    const postDates = posts.map((post) => new Date(post.date)).filter((d) => !isNaN(+d));
    const latestPost = postDates.length ? new Date(Math.max(...postDates.map(Number))) : undefined;

    return [
        { url: baseUrl, lastModified: latestPost, changeFrequency: "weekly", priority: 1 },
        { url: `${baseUrl}/notes`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/art`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.5 },
        { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
        ...posts.map((post) => ({
            url: `${baseUrl}/notes/${post.slug}`,
            lastModified: isNaN(+new Date(post.date)) ? undefined : new Date(post.date),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        ...achievements.map((a) => ({
            url: `${baseUrl}/achievements/${a.slug}`,
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),
    ];
}
