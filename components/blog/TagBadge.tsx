interface TagBadgeProps {
    tag: string;
}

/**
 * Tag badge component with Ember & Ash theme colors
 * Supports light and dark mode styling
 */
export function TagBadge({ tag }: TagBadgeProps) {
    return (
        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-ember-100 text-ember-700 border border-ember-200 dark:bg-ember-900/30 dark:text-ember-400 dark:border-ember-800">
            {tag}
        </span>
    );
}
