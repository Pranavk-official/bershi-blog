"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { useHoliday } from "@/src/hooks/useHoliday";
import { useCountdown } from "@/src/hooks/useCountdown";
import { useViewCycle } from "@/src/hooks/useViewCycle";

// Lazy load heavy effect components
const Fireworks = dynamic(() => import("@/components/ui/fireworks").then(mod => mod.Fireworks), { ssr: false });
const Snow = dynamic(() => import("@/components/ui/snow").then(mod => mod.Snow), { ssr: false });

interface AnnouncementBarProps {
  latestPost?: { title: string; slug: string };
}

export function AnnouncementBar({ latestPost }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [fireworksShown, setFireworksShown] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const activeHoliday = useHoliday();

  // Only cycle if we have both a holiday AND a post
  const shouldCycle = !!activeHoliday && !!latestPost;
  const activeView = useViewCycle(8000, shouldCycle);

  // Setup countdown if the holiday has a target
  const { timeLeft, isExpired, formatTime } = useCountdown(activeHoliday?.countdownTarget);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Trigger fireworks only once when countdown reaches zero
  useEffect(() => {
    if (activeHoliday?.effect === "fireworks" && isExpired && !fireworksShown) {
      setShowFireworks(true);
      setFireworksShown(true);

      // Hide fireworks after duration (10 seconds)
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isExpired, fireworksShown, activeHoliday?.effect]);

  if (!isVisible || !mounted) return null;

  // Fallback: If no holiday, show blog post permanently. If no blog post, hide bar.
  if (!activeHoliday) {
    if (!latestPost) return null;

    return (
      <div className="relative z-50 w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white overflow-hidden" role="status" aria-live="polite">
        <div className="container mx-auto flex h-10 items-center justify-center px-4 text-sm font-medium sm:h-12">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Latest Blog:</span>
            <Link
              href={`/blog/${latestPost.slug}`}
              className="flex items-center gap-1 underline decoration-white/50 underline-offset-4 hover:decoration-white"
            >
              {latestPost.title}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <DismissButton onClick={() => setIsVisible(false)} />
        </div>
      </div>
    );
  }

  return (
    <>
      {showFireworks && <Fireworks duration={10000} />}
      {activeHoliday.effect === "snow" && <div className="fixed inset-0 pointer-events-none z-60"><Snow /></div>}

      <div
        className={`relative z-50 w-full bg-linear-to-r ${activeHoliday.theme.gradient} text-white overflow-hidden`}
        role="status"
        aria-live="polite"
      >
        <div className="absolute inset-0 bg-black/10 opacity-10 mix-blend-soft-light"></div>

        <div className="container mx-auto flex h-10 items-center justify-center px-4 text-sm font-medium sm:h-12">
          <AnimatePresence mode="wait">
            {activeView === "holiday" ? (
              <BlurFade
                key="holiday"
                delay={0.25}
                offset={10}
                direction="up"
                blur="2px"
                duration={0.75}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>{activeHoliday.message}</span>
                {activeHoliday.countdownTarget && (
                  <span className="font-mono font-bold tabular-nums ml-1">
                    {formatTime(timeLeft)}
                  </span>
                )}
              </BlurFade>
            ) : (
              <BlurFade
                key="blog"
                delay={0.25}
                offset={10}
                direction="up"
                blur="2px"
                duration={0.75}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline">Latest Update:</span>
                <Link
                  href={`/blog/${latestPost?.slug}`}
                  className="flex items-center gap-1 underline decoration-white/50 underline-offset-4 hover:decoration-white"
                >
                  {latestPost?.title}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </BlurFade>
            )}
          </AnimatePresence>

          <DismissButton onClick={() => setIsVisible(false)} />
        </div>
      </div>
    </>
  );
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2.5 hover:bg-white/20 active:bg-white/30 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
      aria-label="Dismiss announcement"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
