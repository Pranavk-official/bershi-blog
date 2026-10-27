// Kept out of lib/notion.ts so client components can import it without
// pulling the Notion SDK into the browser bundle.

export type SortOption = "newest" | "oldest" | "title";

export const DEFAULT_SORT: SortOption = "newest";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
];

export function parseSort(value: string | undefined): SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SortOption)
    : DEFAULT_SORT;
}
