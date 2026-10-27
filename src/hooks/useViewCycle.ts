import { useState, useEffect } from "react";

export function useViewCycle(intervalMs: number = 5000, shouldCycle: boolean = true) {
  const [activeView, setActiveView] = useState<"holiday" | "blog">("holiday");

  useEffect(() => {
    if (!shouldCycle) {
      // Wrap in timeout to avoid synchronous state update warning
      const t = setTimeout(() => setActiveView("holiday"), 0);
      return () => clearTimeout(t);
    }

    const timer = setInterval(() => {
      setActiveView((prev) => (prev === "holiday" ? "blog" : "holiday"));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, shouldCycle]);

  return activeView;
}
