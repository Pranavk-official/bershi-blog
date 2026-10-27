"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function TimelineConnector() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const connectorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!connectorRef.current) return;

            const rect = connectorRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate how much of the timeline is visible
            const timelineTop = rect.top;
            const timelineHeight = rect.height;

            // Progress starts when timeline enters viewport and completes when it exits
            const progress = Math.max(0, Math.min(1,
                (viewportHeight - timelineTop) / (timelineHeight + viewportHeight)
            ));

            setScrollProgress(progress);
        };

        handleScroll(); // Initial calculation
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <div
            ref={connectorRef}
            className={cn(
                // Mobile: positioned at left edge (8px from left)
                "absolute left-2 md:left-1/2 md:-translate-x-1/2",
                // Full height of timeline
                "top-0 bottom-0 w-0.5",
                // Ensure it's behind the dots but visible
                "z-0"
            )}
        >
            {/* Background line */}
            <div className={cn(
                "absolute inset-0",
                "bg-gradient-to-b from-ember-500/20 via-teal-500/20 to-ember-500/20"
            )} />

            {/* Animated progress line */}
            <div
                className={cn(
                    "absolute top-0 left-0 right-0",
                    "bg-gradient-to-b from-ember-500 via-teal-500 to-ember-500",
                    "transition-all duration-100 ease-out"
                )}
                style={{
                    height: `${scrollProgress * 100}%`,
                }}
            />
        </div>
    );
}
