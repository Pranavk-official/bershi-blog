"use client";

import { useEffect, useRef, useState } from "react";
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

// One blink each time the pointer comes over the face. Kept with the
// component so it doesn't depend on the global stylesheet.
const blinkCss = `
@keyframes smiley-blink { 0%, 100% { scale: 1 1 } 45%, 55% { scale: 1 0.1 } }
.smiley .smiley-eyes path { transform-box: fill-box; transform-origin: center }
.smiley:hover .smiley-eyes path { animation: smiley-blink 0.26s ease-in-out }
@media (prefers-reduced-motion: reduce) { .smiley:hover .smiley-eyes path { animation: none } }
`;

/**
 * Blinks on hover; winks when clicked or tapped. Purely playful, so it stays
 * out of the accessibility tree and off the tab order.
 */
export function Smiley({ className }: DoodleProps) {
  const [wink, setWink] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onPointerDown = () => {
    clearTimeout(timer.current);
    setWink(true);
    timer.current = setTimeout(() => setWink(false), 700);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      className={cn(
        "smiley size-12 cursor-pointer touch-manipulation transition-transform duration-300 ease-out select-none",
        "motion-reduce:transform-none!",
        className,
      )}
      // `transform`, not the rotate utility, so it stacks on a rotate the caller sets.
      style={wink ? { transform: "rotate(-10deg) scale(1.1)" } : undefined}
    >
      <style>{blinkCss}</style>
      <circle {...ink} cx="24" cy="24" r="21" />
      <g className="smiley-eyes">
        <path {...ink} d="M17 18v4" />
        {wink ? <path {...ink} d="M28 21.5q3-3.5 6 0" /> : <path {...ink} d="M31 18v4" />}
      </g>
      <path {...ink} d={wink ? "M13 28c5 9 17 9 22 0" : "M14 29c5 7 15 7 20 0"} />
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
