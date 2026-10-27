"use client";

import { useState, useCallback, useMemo } from "react";

interface UsePaginatedItemsOptions<T> {
    items: T[];
    itemsPerPage?: number;
}

interface UsePaginatedItemsReturn<T> {
    visibleItems: T[];
    hasMore: boolean;
    loadMore: () => void;
    reset: () => void;
    currentPage: number;
    totalPages: number;
}

/**
 * Custom hook for paginated "Show More" functionality
 * @param items - Array of items to paginate
 * @param itemsPerPage - Number of items to show per page (default: 6)
 */
export function usePaginatedItems<T>({
    items,
    itemsPerPage = 6,
}: UsePaginatedItemsOptions<T>): UsePaginatedItemsReturn<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(
        () => Math.ceil(items.length / itemsPerPage),
        [items.length, itemsPerPage]
    );

    const visibleItems = useMemo(
        () => items.slice(0, currentPage * itemsPerPage),
        [items, currentPage, itemsPerPage]
    );

    const hasMore = currentPage < totalPages;

    const loadMore = useCallback(() => {
        if (hasMore) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [hasMore]);

    const reset = useCallback(() => {
        setCurrentPage(1);
    }, []);

    return {
        visibleItems,
        hasMore,
        loadMore,
        reset,
        currentPage,
        totalPages,
    };
}
