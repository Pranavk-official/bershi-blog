import { cn } from "@lib/utils";

// Hand-drawn ink doodles for the scrapbook layout. Decorative only.
type DoodleProps = { className?: string };

const ink = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Squiggle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden="true" className={cn("h-2 w-24", className)}>
      <path {...ink} strokeWidth={2.2} vectorEffect="non-scaling-stroke" d="M2 5c14-4 22 2 36-1s24-3 38 0 26 1 42-2" />
    </svg>
  );
}

export function Star({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <path {...ink} d="M16 3v26M4 10l24 12M28 9 5 23" />
    </svg>
  );
}

export function Smiley({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-12", className)}>
      <circle {...ink} cx="24" cy="24" r="21" />
      <path {...ink} d="M17 18v4M31 18v4M14 29c5 7 15 7 20 0" />
    </svg>
  );
}

export function Flower({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 150" aria-hidden="true" className={cn("h-36 w-14", className)}>
      <g {...ink}>
        <path d="M22 30c2 40-4 70 6 115M40 52c-6 18-12 34-12 60M28 145c-6-14-14-20-22-22M28 120c8-10 18-12 26-10" />
        <circle cx="22" cy="22" r="4" />
        <path d="M22 18c-4-10 8-10 4 0M26 21c10-4 10 8 0 4M24 26c4 10-8 10-4 0M18 23c-10 4-10-8 0-4M19 19c-6-6 2-10 3-2M25 19c6-6 10 2 2 3M25 25c6 6-2 10-3 2M19 25c-6 6-10-2-2-3" />
        <circle cx="42" cy="46" r="3" />
        <path d="M42 43c-3-8 6-8 3 0M45 46c8-3 8 6 0 3M42 49c3 8-6 8-3 0M39 46c-8 3-8-6 0-3" />
      </g>
    </svg>
  );
}
