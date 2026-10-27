'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@uidotdev/usehooks';
import { Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Search({ placeholder = 'Search posts...' }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [inputValue, setInputValue] = useState(() => searchParams.get('search') || '');
    const debouncedSearchTerm = useDebounce(inputValue, 300);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchParamsRef = useRef(searchParams);
    useEffect(() => { searchParamsRef.current = searchParams; }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsRef.current);
        const term = debouncedSearchTerm.trim();

        // Bail when the URL already matches — otherwise the mount pass would
        // reset `page` and bounce anyone landing on /blog?page=3 back to 1.
        if (term === (params.get('search') ?? '')) return;

        params.set('page', '1');

        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [debouncedSearchTerm, pathname, replace]);

    const handleClear = () => {
        setInputValue('');
        inputRef.current?.focus();
    };

    return (
        <div className="relative w-full">
            <SearchIcon
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
                ref={inputRef}
                type="search"
                inputMode="search"
                enterKeyHint="search"
                aria-label="Search posts by title, description or tag"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-11 border-2 pl-10 pr-11 text-[15px] [&::-webkit-search-cancel-button]:hidden"
            />
            {inputValue && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X />
                </Button>
            )}
        </div>
    );
}
