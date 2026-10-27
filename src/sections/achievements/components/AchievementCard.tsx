"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, ArrowRight } from "lucide-react";
import type { Achievement } from "../config/achievements";

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  rotation?: string;
}

export function AchievementCard({
  achievement,
  index,
  rotation = "",
}: AchievementCardProps) {
  // const Icon = achievement.icon;

  return (
    <article className={`group relative ${rotation}`} key={index}>
      <Link href={`/achievements/${achievement.slug}`} className="block">
        <div
          className="relative overflow-hidden rounded-2xl border border-border/50 
                     bg-card/80 backdrop-blur-sm
                     shadow-sm hover:shadow-xl hover:border-border
                     transition-all duration-300 ease-out
                     dark:bg-card/40 dark:hover:bg-card/60
                     w-full max-w-120 h-72"
        >
          {/* Image Area */}
          <div className="relative h-32 w-full overflow-hidden">
            {achievement.image ? (
              <Image
                src={achievement.image}
                alt={achievement.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-linear-to-br ${achievement.accentColor}`}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
                  <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                </div>
              </div>
            )}

            {/* Year Badge - Top Right */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-amber-400 text-amber-900 shadow-lg">
                {achievement.date}
              </span>
            </div>

            {/* Trophy Icon - Bottom Left */}
            <div className="absolute bottom-3 left-4 z-10">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-400 shadow-lg border-4 border-white dark:border-card">
                <Trophy className="w-4 h-4 text-amber-900" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-8">
            <h3
              className="text-lg font-bold text-foreground mb-1 
                         group-hover:text-primary transition-colors line-clamp-1"
            >
              {achievement.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium mb-3">
              {achievement.organization}
            </p>
            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-3">
              {achievement.shortDescription}
            </p>
          </div>

          {/* Hover Overlay - View Details */}
          <div className="absolute inset-0 z-20 bg-background/55 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-content-center rounded-2xl">
            <div className="flex items-center gap-2 text-primary font-semibold text-lg">
              <span>View Details</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
