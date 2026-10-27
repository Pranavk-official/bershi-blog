"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DEFAULT_SORT, SORT_OPTIONS, parseSort } from "@lib/blogSort";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

export function SortSelect() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const current = parseSort(searchParams.get("sort") ?? undefined);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    // Keep the default out of the URL so /blog stays clean.
    if (parseSort(value) === DEFAULT_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger
        id="blog-sort"
        aria-label="Sort posts"
        // h-11/border-2 match Search so the row lines up and keeps the 44px touch target.
        className="h-11 w-full shrink-0 border-2 text-[15px] sm:w-44"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
