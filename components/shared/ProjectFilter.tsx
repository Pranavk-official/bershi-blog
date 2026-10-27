"use client";

import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";

export type ProjectCategory = "all" | "web-app" | "mobile" | "tool" | "community";

interface CategoryOption {
    value: ProjectCategory;
    label: string;
}

const categories: CategoryOption[] = [
    { value: "all", label: "All" },
    { value: "web-app", label: "Web App" },
    { value: "mobile", label: "Mobile" },
    { value: "tool", label: "Tool" },
    { value: "community", label: "Community" },
];

interface ProjectFilterProps {
    activeCategory: ProjectCategory;
    onCategoryChange: (category: ProjectCategory) => void;
    className?: string;
}

export function ProjectFilter({
    activeCategory,
    onCategoryChange,
    className,
}: ProjectFilterProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-center gap-2",
                className
            )}
            role="tablist"
            aria-label="Filter projects by category"
        >
            {categories.map((category) => (
                <Button
                    key={category.value}
                    variant={activeCategory === category.value ? "default" : "outline"}
                    size="sm"
                    role="tab"
                    aria-selected={activeCategory === category.value}
                    aria-controls="projects-grid"
                    onClick={() => onCategoryChange(category.value)}
                    className={cn(
                        "transition-all duration-200",
                        activeCategory === category.value
                            ? "shadow-md"
                            : "hover:bg-primary/10"
                    )}
                >
                    {category.label}
                </Button>
            ))}
        </div>
    );
}

export { categories };
