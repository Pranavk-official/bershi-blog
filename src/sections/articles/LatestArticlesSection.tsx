import Link from "next/link";
import { getAllPublished } from "@/lib/notion";
import { ArticlesGrid } from "./components/ArticlesGrid";
import { Button } from "@components/ui/button";
import { ArrowRight } from "lucide-react";
import ScrollElement from "@components/ui/scroll-animation";

// Enable ISR with 60-second revalidation
export const revalidate = 60;

const LatestArticlesSection = async () => {
    // Fetch all published posts and get the latest 3
    const allPosts = await getAllPublished();
    const latestPosts = allPosts.slice(0, 3);

    // Don't render the section if there are no posts
    if (latestPosts.length === 0) {
        return null;
    }

    return (
        <section
            className="relative py-20 min-h-screen flex items-center"
            aria-labelledby="articles-heading"
        >
            <div className="container mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <ScrollElement
                        viewport={{ amount: 0.5, margin: "0px 0px -100px 0px" }}
                        className="mx-auto max-w-3xl"
                    >
                        <h2
                            id="articles-heading"
                            className="text-4xl font-bold tracking-tight md:text-5xl"
                        >
                            <span className="text-foreground">Latest </span>
                            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Articles
                            </span>
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Insights, tutorials, and updates from my blog
                        </p>
                    </ScrollElement>
                </div>

                {/* Articles Grid */}
                <ArticlesGrid posts={latestPosts} />

                {/* View All Articles Link */}
                <div className="flex justify-center">
                    <Link href="/blog">
                        <Button variant="ghost" className="group gap-2 text-primary">
                            View All Articles
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestArticlesSection;
