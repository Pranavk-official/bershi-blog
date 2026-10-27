import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getSinglePost, getAllPublisedSlugs } from "@/lib/notion";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { BackToTop } from "@/components/blog/back-to-top";

// Force all posts to be generated on-demand (SSR)
// export const dynamic = 'force-dynamic';

// Enable ISR with 600-second revalidation
export const revalidate = 600;

/**
 * Generate static params for all published posts
 */
export async function generateStaticParams() {
    // Skip if Notion credentials are not available (e.g., during build without env vars)
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATA_SOURCE_ID) {
        console.warn("Notion credentials not available, skipping static generation");
        return [];
    }

    try {
        const slugs = await getAllPublisedSlugs();
        // console.log('🎯 generateStaticParams - slugs:', slugs);
        return slugs.map((slug) => ({
            slug,
        }));
    } catch (error) {
        console.warn("Failed to fetch slugs for static generation:", error);
        return [];
    }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>; // ← Changed to Promise
}): Promise<Metadata> {
    const { slug } = await params; // ← Await params
    // console.log('📝 generateMetadata - slug:', slug);

    const post = await getSinglePost(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    const siteConfig = (await import("@config/site")).siteConfig;
    const postUrl = `${siteConfig.url}/blog/${slug}`;

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            url: postUrl,
            siteName: siteConfig.name,
            publishedTime: post.date,
            authors: [siteConfig.author.name],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            creator: "@Arch_Lad_",
        },
    };
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>; // ← Changed to Promise
}) {
    const { slug } = await params; // ← Await params
    // console.log('📄 PostPage - slug:', slug);

    const post = await getSinglePost(slug);

    // Handle 404 case
    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
            <article className="max-w-3xl mx-auto">
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/blog">Blog</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="line-clamp-1">
                                {post.title}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Back to All Posts Button */}
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/blog" className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Back to All Posts
                        </Link>
                    </Button>
                </div>

                <Card className="p-8 mb-8">
                    <header className="mb-8">
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold font-crimson text-foreground mb-6">
                            {post.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-col gap-4 mb-6">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                <time dateTime={post.date}>
                                    {formatDate(post.date)}
                                </time>
                            </div>

                            {/* Tags */}
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {post.description && (
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {post.description}
                            </p>
                        )}
                    </header>
                </Card>

                {/* Post Content */}
                <div className="prose prose-ash prose-lg dark:prose-invert max-w-none mb-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Bottom Navigation */}
                <div className="flex justify-center pt-8 border-t">
                    <Button variant="outline" asChild>
                        <Link href="/blog" className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Back to All Posts
                        </Link>
                    </Button>
                </div>
            </article>

            {/* Back to Top Button */}
            <BackToTop />
        </div>
    );
}
