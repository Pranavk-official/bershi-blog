"use client";

import { PostMetadata } from "@/lib/notion";
import { Spotlight, SpotLightItem } from "@/components/ui/spotlight";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArticleCard } from "./ArticleCard";

interface ArticlesGridProps {
    posts: PostMetadata[];
}

export function ArticlesGrid({ posts }: ArticlesGridProps) {
    return (
        <Spotlight
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12"
            ProximitySpotlight
            CursorFlowGradient
        >
            {posts.map((post, idx) => (
                <BlurFade key={post.id} delay={0.25 + idx * 0.05} inView>
                    <SpotLightItem className="h-full">
                        <ArticleCard article={post} index={idx} />
                    </SpotLightItem>
                </BlurFade>
            ))}
        </Spotlight>
    );
}
