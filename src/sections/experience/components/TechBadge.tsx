import { cn } from "@/lib/utils";

interface TechBadgeProps {
    label: string;
}

export function TechBadge({ label }: TechBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-1",
                "text-xs font-medium rounded-md",
                "bg-secondary/60 text-secondary-foreground",
                "border border-border/50",
                // Dark mode enhancements
                "dark:bg-secondary/40"
            )}
        >
            {label}
        </span>
    );
}
