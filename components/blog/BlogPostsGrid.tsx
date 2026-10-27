"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Spotlight, SpotLightItem } from "@/components/ui/spotlight";
import { PostMetadata } from "@/lib/notion";

interface BlogPostsGridProps {
    posts: PostMetadata[];
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function BlogPostsGrid({ posts }: BlogPostsGridProps) {
    return (
        <Spotlight
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12"
            ProximitySpotlight
            CursorFlowGradient
        >
            {posts.map((post, idx) => (
                <BlurFade key={post.id} delay={0.25 + idx * 0.05} inView>
                    <SpotLightItem className="h-full">
                        <Link href={`/blog/${post.slug}`} className="group/card block h-full">
                            <div className="relative z-10 h-full overflow-hidden rounded-lg bg-card">
                                <div className="flex flex-col h-full p-6">
                                    <div className="flex flex-col space-y-1.5 mb-4">
                                        <h3 className="font-semibold leading-none tracking-tight font-crimson text-2xl group-hover/card:text-ember-500 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                                            {post.description}
                                        </p>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end">
                                        <div className="flex items-center justify-between text-sm">
                                            <time className="text-muted-foreground">
                                                {formatDate(post.date)}
                                            </time>
                                            {post.tags.length > 0 && (
                                                <div className="flex gap-1 flex-wrap">
                                                    {post.tags.slice(0, 2).map((tagName) => (
                                                        <Badge key={tagName} variant="secondary">
                                                            {tagName}
                                                        </Badge>
                                                    ))}
                                                    {post.tags.length > 2 && (
                                                        <Badge variant="outline">
                                                            +{post.tags.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SpotLightItem>
                </BlurFade>
            ))}
        </Spotlight>
    );
}
