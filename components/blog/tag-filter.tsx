'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagFilterProps {
    tags: string[];
}

export function TagFilter({ tags }: TagFilterProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Parse comma-separated tags param into a Set for O(1) lookup
    const selectedTags = new Set(
        (searchParams.get('tags') ?? '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
    );

    const handleTagClick = (tag: string) => {
        const next = new Set(selectedTags);
        if (next.has(tag)) {
            next.delete(tag);
        } else {
            next.add(tag);
        }

        const params = new URLSearchParams(searchParams);
        params.set('page', '1');

        if (next.size === 0) {
            params.delete('tags');
        } else {
            params.set('tags', Array.from(next).join(','));
        }

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleClear = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('tags');
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (tags.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                    Filter by Tag
                    {selectedTags.size > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground font-normal">
                            ({selectedTags.size} selected)
                        </span>
                    )}
                </h3>
                {selectedTags.size > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="h-auto py-1 px-2 text-xs"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Clear all
                    </Button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const selected = selectedTags.has(tag);
                    return (
                        <Button
                            key={tag}
                            type="button"
                            variant={selected ? 'default' : 'outline'}
                            size="sm"
                            aria-pressed={selected}
                            onClick={() => handleTagClick(tag)}
                            className="cursor-pointer"
                        >
                            {tag}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
