"use client";

import { cn } from "@/lib/utils";
import { WorkExperience } from "../config/workExperience";
import { formatDateRange, toISODate } from "../utils/dateFormatter";
import { TechBadge } from "./TechBadge";
import { BorderBeam } from "@/components/ui/border-beam";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface TimelineItemProps {
  experience: WorkExperience;
  isAlternating: boolean;
  isEffectivelyPresent?: boolean;
}

export function TimelineItem({ experience, isAlternating, isEffectivelyPresent = false }: TimelineItemProps) {
  const isCurrentWorkplace = experience.endDate === "Present" || isEffectivelyPresent;
  const hasAchievements = experience.achievements.length > 0;
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleCardClick = () => {
    if (experience.companyUrl) {
      window.open(experience.companyUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      role="listitem"
      className={cn(
        "group relative mb-12 lg:mb-20",
        "lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-12",
      )}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-0 z-10">
        <div
          className={cn(
            "w-5 h-5 rounded-full",
            isCurrentWorkplace
              ? "bg-teal-500 shadow-lg shadow-teal-500/50"
              : "bg-ember-500",
            "ring-4 ring-background",
            isCurrentWorkplace
              ? "dark:shadow-teal-500/30"
              : "dark:shadow-ember-500/20",
            "transition-transform duration-300 ease-in-out",
            "group-hover:scale-125",
            isCurrentWorkplace && "animate-pulse",
            "motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:animate-none",
          )}
        />
      </div>

      {/* Content card */}
      <div
        className={cn(
          "ml-8 lg:ml-0 relative",
          isAlternating ? "lg:col-start-1" : "lg:col-start-3",
          "rounded-xl border bg-card/50 backdrop-blur-sm p-6 md:p-7",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-xl hover:scale-[1.01] lg:hover:scale-[1.02]",
          isCurrentWorkplace
            ? "hover:border-teal-500/50 shadow-md shadow-teal-500/5"
            : "hover:border-ember-500/50",
          // Dark mode enhancements
          "dark:bg-card/80",
          isCurrentWorkplace
            ? "dark:hover:shadow-teal-500/10 dark:shadow-teal-500/5"
            : "dark:hover:shadow-ember-500/10",
          // Ensure proper spacing on mobile
          "min-w-0",
          // Reduced motion: disable scale transform
          "motion-reduce:hover:scale-100 motion-reduce:transition-none",
          // Cursor pointer when card is clickable
          experience.companyUrl && "cursor-pointer",
        )}
        onClick={experience.companyUrl ? handleCardClick : undefined}
        onMouseEnter={() => hasAchievements && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role={experience.companyUrl ? "link" : undefined}
        aria-label={experience.companyUrl ? `Visit ${experience.company} website` : undefined}
      >
        {isCurrentWorkplace && (
          <BorderBeam
            size={200}
            duration={8}
            colorFrom="#14b8a6"
            colorTo="#06b6d4"
            borderWidth={2}
          />
        )}
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
              {experience.company}
            </h3>
            {isCurrentWorkplace && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 whitespace-nowrap">
                Present
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {experience.location}
          </p>
          <p className="text-base lg:text-lg font-semibold text-foreground/90 mb-1">
            {experience.position}
          </p>
          <time
            className="text-sm text-muted-foreground inline-flex items-center gap-1"
            dateTime={`${toISODate(experience.startDate)}/${toISODate(isEffectivelyPresent ? "Present" : experience.endDate)}`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDateRange(experience.startDate, isEffectivelyPresent ? "Present" : experience.endDate)}
          </time>
        </div>

        {/* Achievements */}
        {hasAchievements && (
          isMobile ? (
            // Mobile: always visible, no animation
            <ul className="space-y-2.5 mb-5" aria-label="Key achievements">
              {experience.achievements.map((achievement, i) => (
                <li key={i} className="text-sm leading-relaxed flex gap-2.5">
                  <span
                    className={cn(
                      "shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full",
                      isCurrentWorkplace ? "bg-teal-500" : "bg-ember-500",
                    )}
                  />
                  <span className="text-foreground/80">{achievement}</span>
                </li>
              ))}
            </ul>
          ) : (
            // Desktop: hidden by default, smooth height + stagger animate on hover
            <AnimatePresence initial={false}>
              {isHovered && (
                <motion.div
                  key="achievements-wrapper"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.3, ease: "easeInOut" },
                  }}
                  className="overflow-hidden"
                >
                  <motion.ul
                    className="space-y-2.5 mb-5"
                    aria-label="Key achievements"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                      hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                    }}
                  >
                    {experience.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        className="text-sm leading-relaxed flex gap-2.5"
                        variants={{
                          hidden: { opacity: 0, x: -8 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                      >
                        <span
                          className={cn(
                            "shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full",
                            isCurrentWorkplace ? "bg-teal-500" : "bg-ember-500",
                          )}
                        />
                        <span className="text-foreground/80">{achievement}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          )
        )}

        {/* Technologies */}
        {experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Technologies used">
            {experience.technologies.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
