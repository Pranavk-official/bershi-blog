"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { TiWeatherSnow } from "react-icons/ti";
import { IoSnowSharp } from "react-icons/io5";
import { BsSnow, BsSnow2, BsSnow3 } from "react-icons/bs";
import {
  SNOW_VISUAL,
  FEATURES,
} from "@/lib/constants";
import {
  getDevicePerformanceProfile,
  usePrefersReducedMotion,
  isMobileDevice,
  isAppleDevice,
} from "@/lib/utils/deviceDetection";
import type { ReactElement } from "react";

interface Snowflake {
  id: number;
  icon: ReactElement;
  startX: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  swayDuration: number;
}

interface SnowProps {
  className?: string;
}

// Seeded random number generator for stable random values
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function Snow({ className }: SnowProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const performanceProfile = getDevicePerformanceProfile();

  // Snowflake icon components
  const snowflakeIcons = useMemo(() => [
    TiWeatherSnow,
    IoSnowSharp,
    BsSnow,
    BsSnow2,
    BsSnow3,
  ], []);

  // Generate snowflakes with memoization for performance
  const snowflakes = useMemo(() => {
    const maxSnowflakes = performanceProfile.maxParticles;
    
    return Array.from({ length: maxSnowflakes }, (_, i) => {
      // Use seeded random for stable values across renders
      const iconIndex = Math.floor(seededRandom(i * 1.1) * snowflakeIcons.length);
      const IconComponent = snowflakeIcons[iconIndex];
      
      // Size calculation: mostly small, few large (approx 5-8% chance)
      const isLarge = seededRandom(i * 1.9) > 0.93;
      const baseSize = seededRandom(i * 1.2) * 6 + 10; // 10px - 16px
      const largeSize = seededRandom(i * 1.2) * 12 + 24; // 24px - 36px
      const size = isLarge ? largeSize : baseSize;

      const duration = seededRandom(i * 1.3) * 8 + 12; // 12-20 seconds
      const delay = seededRandom(i * 1.4) * -20; // Stagger start times
      
      // Calculate opacity with global multiplier
      const baseOpacity = seededRandom(i * 1.5) * (SNOW_VISUAL.MAX_OPACITY - SNOW_VISUAL.MIN_OPACITY) + SNOW_VISUAL.MIN_OPACITY;
      const opacity = baseOpacity * (SNOW_VISUAL.OPACITY_MULTIPLIER || 1);
      
      const drift = (seededRandom(i * 1.6) - 0.5) * 100; // Horizontal drift
      const startX = seededRandom(i * 1.7) * 100; // Percentage
      const swayDuration = seededRandom(i * 1.8) * 3 + 4; // 4-7 seconds sway cycle

      return {
        id: i,
        icon: <IconComponent key={i} />,
        startX,
        size,
        duration,
        delay,
        opacity,
        drift,
        swayDuration,
      } as Snowflake;
    });
  }, [performanceProfile.maxParticles, snowflakeIcons]);

  // Don't render if reduced motion is preferred and feature is enabled
  if (FEATURES.RESPECT_REDUCED_MOTION && prefersReducedMotion) {
    return null;
  }

  if (!FEATURES.ENABLE_SNOW) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none z-40",
        className
      )}
      aria-hidden="true"
    >
      {snowflakes.map((snowflake) => (
        <motion.div
          key={snowflake.id}
          className="absolute text-gray-400 dark:text-white transition-colors duration-300"
          style={{
            left: `${snowflake.startX}%`,
            top: "-10%",
            fontSize: `${snowflake.size}px`,
            filter: "drop-shadow(0 0 2px currentColor)",
          }}
          initial={{ opacity: 0 }}
          animate={{
            y: ["-10vh", "110vh"], // Start slightly above, end below
            x: [0, snowflake.drift, 0, -snowflake.drift, 0], // Smooth swaying cycle
            rotate: [0, 360],
            opacity: [
              0,                    // Start: invisible
              snowflake.opacity,    // Fade in
              snowflake.opacity,    // Stay visible
              0                     // Fade out
            ],
          }}
          transition={{
            duration: snowflake.duration,
            delay: snowflake.delay,
            repeat: Infinity,
            ease: "linear",
            y: {
              duration: snowflake.duration,
              repeat: Infinity,
              ease: "linear",
            },
            x: {
              duration: snowflake.swayDuration,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: snowflake.duration * 0.5,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: snowflake.duration,
              times: [0, 0.1, 0.85, 1], // Smoother fade in/out
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {snowflake.icon}
        </motion.div>
      ))}
      
      {FEATURES.DEBUG_MODE && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded font-mono text-xs pointer-events-auto">
          <div>Snowflakes: {snowflakes.length}</div>
          <div>Device: {isMobileDevice() ? "Mobile" : "Desktop"}</div>
          <div>Apple: {isAppleDevice() ? "Yes" : "No"}</div>
        </div>
      )}
    </div>
  );
}