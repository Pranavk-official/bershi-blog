import { useEffect, useState } from "react";

/**
 * Device detection utilities for optimizing performance across different platforms
 */

/**
 * Detects if the current device is running iOS (iPhone, iPad, iPod)
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) // iPad Pro with iOS 13+
  );
}

/**
 * Detects if the current device is running macOS
 */
export function isMacOS(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    navigator.platform.indexOf("Mac") > -1 &&
    navigator.maxTouchPoints === 0 // Exclude iPads
  );
}

/**
 * Detects if the current browser is Safari (desktop or mobile)
 */
export function isSafari(): boolean {
  if (typeof window === "undefined") return false;
  
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.indexOf("safari") > -1 &&
    ua.indexOf("chrome") === -1 &&
    ua.indexOf("chromium") === -1
  );
}

/**
 * Detects if the current device is an Apple device (iOS or macOS)
 */
export function isAppleDevice(): boolean {
  return isIOS() || isMacOS();
}

/**
 * Detects if the current device is a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
}

/**
 * Detects if the current device is a tablet
 */
export function isTabletDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    (/iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent)) ||
    (window.innerWidth >= 768 && window.innerWidth < 1024)
  );
}

/**
 * Gets the device memory in GB if available
 * Returns undefined if the API is not supported
 */
export function getDeviceMemory(): number | undefined {
  if (typeof window === "undefined") return undefined;
  
  // @ts-expect-error - deviceMemory is not in TypeScript's lib.dom.d.ts yet
  return navigator.deviceMemory as number | undefined;
}

/**
 * Detects if the device has low memory (< 4GB)
 */
export function isLowMemoryDevice(): boolean {
  const memory = getDeviceMemory();
  return memory !== undefined && memory < 4;
}

/**
 * Gets the device pixel ratio for handling retina displays
 */
export function getDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1;
  return window.devicePixelRatio || 1;
}

/**
 * Detects if the device/browser prefers reduced motion for accessibility
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * React hook that detects if the user prefers reduced motion
 * Updates when the preference changes
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return prefersReducedMotion();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    
    // Fallback for older Safari versions (deprecated but needed)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legacyMediaQuery = mediaQuery as any;
    legacyMediaQuery.addListener(handleChange);
    return () => legacyMediaQuery.removeListener(handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Gets optimal performance settings based on device capabilities
 */
export function getDevicePerformanceProfile(): {
  maxParticles: number;
  targetFPS: number;
  enableComplexEffects: boolean;
} {
  const isApple = isAppleDevice();
  const isMobile = isMobileDevice();
  const isTablet = isTabletDevice();
  const isLowMemory = isLowMemoryDevice();

  // Low memory or old iOS devices - minimal settings
  if (isLowMemory || (isIOS() && isLowMemory)) {
    return {
      maxParticles: 15,
      targetFPS: 30,
      enableComplexEffects: false,
    };
  }

  // Mobile devices
  if (isMobile) {
    return {
      maxParticles: 25,
      targetFPS: isApple ? 30 : 45, // iOS battery optimization
      enableComplexEffects: false,
    };
  }

  // Tablet devices
  if (isTablet) {
    return {
      maxParticles: 50,
      targetFPS: 45,
      enableComplexEffects: true,
    };
  }

  // Desktop devices
  return {
    maxParticles: 80,
    targetFPS: 60,
    enableComplexEffects: true,
  };
}
