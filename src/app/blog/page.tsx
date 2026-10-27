import { Metadata } from "next";
import { Suspense } from "react";

import { getFilteredPosts, getAllTags } from "@/lib/notion";
import { parseSort } from "@/lib/blogSort";
import { Search } from "@/components/blog/search";
import { SortSelect } from "@/components/blog/sort-select";
import { TagFilter } from "@/components/blog/tag-filter";
import { Pagination } from "@/components/blog/pagination";
import { ListingPost } from "@/components/blog/ListingPost";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Notes",
    description: "Insights, tutorials, and updates about web development, design, and technology.",
    alternates: {
        canonical: "/blog",
    },
};

// Enable ISR with 60-second revalidation
export const revalidate = 60;

interface BlogPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        tags?: string;
        sort?: string;
    }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = params.search || '';
    const tags = params.tags || '';
    const sort = parseSort(params.sort);

    const [{ posts, total, totalPages, error }, allTags] = await Promise.all([
        getFilteredPosts(page, 6, search, tags, sort),
        getAllTags(),
    ]);

    const selectedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const summary = error
        ? "Posts unavailable"
        : [
            `${total} ${total === 1 ? 'post' : 'posts'}`,
            search && ` matching "${search}"`,
            selectedTags.length > 0 &&
            ` tagged with ${selectedTags.map((t) => `"${t}"`).join(', ')}`,
        ].filter(Boolean).join('');

    return (
        <section className="page pt-14 sm:pt-20" aria-labelledby="blog-heading">
            <header className="text-center">
                <h1
                    id="blog-heading"
                    className="text-4xl leading-tight sm:text-5xl"
                >
                    Notes
                </h1>
                <p aria-live="polite" className="mt-1.5 text-sm text-muted-foreground">
                    {summary}
                </p>
            </header>

            <div className="mt-8 space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Suspense fallback={<Skeleton className="h-11 w-full" />}>
                        <Search placeholder="Search posts by title, description or tag..." />
                    </Suspense>
                    <Suspense fallback={<Skeleton className="h-11 w-full sm:w-44" />}>
                        <SortSelect />
                    </Suspense>
                </div>
                <Suspense fallback={<Skeleton className="h-16 w-full" />}>
                    <TagFilter tags={allTags} />
                </Suspense>
            </div>

            {error ? (
                <p className="py-16 text-center text-destructive">
                    Something went wrong while loading posts. Please check back later.
                </p>
            ) : posts.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">
                    No posts found{(search || tags) && '. Try adjusting your filters.'}
                </p>
            ) : (
                <div className="mt-14 grid gap-x-8 gap-y-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <ListingPost key={post.id} post={post} index={index} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-14 sm:mt-20">
                    <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                        <Pagination currentPage={page} totalPages={totalPages} />
                    </Suspense>
                </div>
            )}
        </section>
    );
}
