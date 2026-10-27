"use client";

import { achievements } from "./config/achievements";
import { AchievementCard } from "./components/AchievementCard";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

const AchievementsSection = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -10]);

  // Fade out header as we scroll (0 = visible, 1 = hidden)
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  //   const headerScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.3], [0, 10]);

  // First card blur reveal effect
  const firstCardBlur = useMotionValue<number>(10);
  const firstCardOpacity = useMotionValue<number>(0);

  // Handle scroll to drive first card reveal effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress for first card reveal (after header)
      // Start revealing when section is in view, complete by ~30% scroll
      const progress = Math.max(
        0,
        Math.min(1, (-rect.top + windowHeight * 0.5) / (windowHeight * 1.5)),
      );

      firstCardBlur.set(10 * (1 - progress));
      firstCardOpacity.set(Math.min(1, progress * 2));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [firstCardBlur, firstCardOpacity]);

  // Mobile - scroll stacking effect (mirrors desktop behavior in a single-column layout)
  if (isMobile) {
    return (
      <section
        ref={containerRef}
        className="relative bg-background overflow-x-clip"
        aria-labelledby="achievements-heading"
      >
        {/* Section Header - Sticky with fade out and blur */}
        <motion.section
          className="sticky top-0 h-screen w-full grid place-content-center z-0"
          style={{
            opacity: headerOpacity,
            scale: scale,
            rotate: rotate,
            filter: `blur(${headerBlur}px)`,
          }}
        >
          <div className="relative z-10 text-center px-4">
            <h2
              id="achievements-heading"
              className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-4xl sm:text-5xl font-bold tracking-tight text-transparent leading-[120%]"
            >
              Achievements
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              Milestones and recognitions along my journey 👇
            </p>
          </div>
        </motion.section>

        {/* Stacking Cards Section */}
        <section className="relative z-10 w-full bg-background">
          <div className="grid gap-2 px-4">
            {achievements.map((achievement, index) => {
              // Simple rotation pattern: 0 = rotate-6, 1 = none, 2 = -rotate-6, 3 = none
              const getRotation = (idx: number) => {
                const pattern = idx % 4;
                if (pattern === 0) return "rotate-6";
                if (pattern === 2) return "-rotate-6";
                return "";
              };

              return (
                <motion.figure
                  key={achievement.id}
                  className="sticky top-0 h-screen grid place-content-center"
                  style={
                    index === 0
                      ? {
                          filter: firstCardBlur,
                          opacity: firstCardOpacity,
                        }
                      : undefined
                  }
                >
                  <AchievementCard
                    achievement={achievement}
                    index={index}
                    rotation={getRotation(index)}
                  />
                </motion.figure>
              );
            })}
          </div>
        </section>
      </section>
    );
  }

  // Desktop - scroll stacking effect
  return (
    <section
      ref={containerRef}
      className="relative bg-background"
      aria-labelledby="achievements-heading"
    >
      {/* Section Header - Sticky with fade out and blur */}
      <motion.section
        className="sticky top-0 h-screen w-full grid place-content-center z-0"
        style={{
          opacity: headerOpacity,
          scale: scale,
          rotate: rotate,
          filter: `blur(${headerBlur}px)`,
        }}
      >
        <div className="relative z-10 text-center">
          <h2
            id="achievements-heading"
            className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-transparent px-4 sm:px-8 leading-[120%]"
          >
            Achievements
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            Milestones and recognitions along my journey 👇
          </p>
        </div>
      </motion.section>

      {/* Stacking Cards Section */}
      <section className="relative z-10 w-full bg-background">
        <div className="flex justify-around px-4 md:px-16">
          <div className="grid gap-2">
            {achievements.map((achievement, index) => {
              // Simple rotation pattern: 0 = rotate-6, 1 = none, 2 = -rotate-6, 3 = none
              const getRotation = (idx: number) => {
                const pattern = idx % 4;
                if (pattern === 0) return "rotate-6";
                if (pattern === 2) return "-rotate-6";
                return "";
              };

              return (
                <motion.figure
                  key={achievement.id}
                  className="sticky top-0 h-screen grid place-content-center"
                  style={{
                    filter: firstCardBlur,
                    opacity: firstCardOpacity,
                  }}
                >
                  <AchievementCard
                    achievement={achievement}
                    index={index}
                    rotation={getRotation(index)}
                  />
                </motion.figure>
              );
            })}
          </div>
          <div className="sticky top-0 h-screen place-content-center hidden lg:grid">
            <h3 className="text-3xl lg:text-4xl px-6 lg:px-8 font-medium text-center tracking-tight leading-[120%]">
              What I&apos;ve <br /> Achieved 🏆
            </h3>
          </div>
        </div>
      </section>
    </section>
  );
};

export default AchievementsSection;
