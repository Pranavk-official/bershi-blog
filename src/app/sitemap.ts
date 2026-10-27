import { MetadataRoute } from "next";
import { siteConfig } from "@config/site";
import { getAllPublished } from "@/lib/notion";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // Static routes
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/art`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.5,
        },
    ];

    // Dynamic blog post routes from Notion
    // Only fetch if Notion credentials are available
    let blogRoutes: MetadataRoute.Sitemap = [];

    if (process.env.NOTION_TOKEN && process.env.NOTION_DATA_SOURCE_ID) {
        try {
            const posts = await getAllPublished();
            blogRoutes = posts.map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            }));
        } catch (error) {
            console.warn("Failed to fetch blog posts for sitemap:", error);
            // Return static routes only on error
        }
    }

    return [...routes, ...blogRoutes];
}
