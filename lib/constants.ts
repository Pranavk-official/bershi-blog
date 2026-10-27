/**
 * Global constants for the portfolio application
 */

/**
 * Christmas Season Configuration
 * Controls when the snow animation overlay is displayed
 */
export const CHRISTMAS_SEASON = {
  /** Start month (1-12, December = 12) */
  START_MONTH: 12,
  /** Start day of month */
  START_DAY: 1,
  /** End month (1-12, December = 12) */
  END_MONTH: 12,
  /** End day of month */
  END_DAY: 25,
} as const;

/**
 * New Year Season Configuration
 * Controls when the countdown and fireworks are displayed
 */
export const NEW_YEAR_SEASON = {
  /** Start month (1-12, December = 12) */
  START_MONTH: 12,
  /** Start day of month */
  START_DAY: 26,
  /** End month (1-12, January = 1) */
  END_MONTH: 1,
  /** End day of month */
  END_DAY: 5,
} as const;

/**
 * Snow Visual Configuration
 */
export const SNOW_VISUAL = {
  /** Minimum snowflake size (radius in pixels) */
  MIN_SIZE: 2,
  /** Maximum snowflake size (radius in pixels) */
  MAX_SIZE: 5,
  /** Minimum falling speed (pixels per frame) */
  MIN_SPEED: 0.5,
  /** Maximum falling speed (pixels per frame) */
  MAX_SPEED: 2,
  /** Minimum opacity */
  MIN_OPACITY: 0.3,
  /** Maximum opacity */
  MAX_OPACITY: 0.8,
  /** Overall opacity multiplier (0-1) to easily adjust visibility */
  OPACITY_MULTIPLIER: 0.6,
  /** Maximum wind effect (horizontal drift) */
  MAX_WIND: 0.5,
  /** Wind change frequency */
  WIND_CHANGE_FREQUENCY: 0.01,
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  /** Enable snow animation globally */
  ENABLE_SNOW: true,
  /** Enable device-specific optimizations */
  ENABLE_DEVICE_OPTIMIZATION: true,
  /** Respect prefers-reduced-motion setting */
  RESPECT_REDUCED_MOTION: true,
  /** Enable debug mode (shows FPS and particle count) */
  DEBUG_MODE: false,
} as const;
