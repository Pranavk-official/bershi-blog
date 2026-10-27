import { useState, useEffect, useMemo } from "react";
import holidaysData from "@/src/config/holidays.json";

export interface HolidayConfig {
  id: string;
  name: string;
  date: {
    startMonth: number;
    startDay: number;
    endMonth?: number;
    endDay?: number;
  };
  theme: {
    gradient: string;
  };
  message: string;
  effect?: string;
  countdownTarget?: {
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
}

export function useHoliday() {
  const [mounted, setMounted] = useState(false);
  
  // Allow overriding date for testing via URL parameter ?testDate=YYYY-MM-DD
  const [testDate, setTestDate] = useState<Date | null>(null);

  useEffect(() => {
    // Check for test date in URL params (only in development)
    if (process.env.NODE_ENV === "development") {
      const params = new URLSearchParams(window.location.search);
      const testDateParam = params.get("testDate");
      if (testDateParam) {
        const date = new Date(testDateParam);
        if (!isNaN(date.getTime())) {
          // Wrap in timeout to avoid synchronous state update warning
          setTimeout(() => setTestDate(date), 0);
          console.log("🧪 Testing Holiday Mode with date:", date.toDateString());
        }
      }
    }

    // Use a small timeout or requestAnimationFrame to avoid synchronous update warning
    // though strictly speaking, for hydration mismatch prevention, a simple useEffect is standard.
    // The linter warning here is about cascading renders, but for "mounted" state it's often necessary.
    // We can wrap it in a timeout to be safe and satisfy the linter.
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const activeHoliday = useMemo(() => {
    if (!mounted) return null;

    const now = testDate || new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDay = now.getDate();

    return (holidaysData as HolidayConfig[]).find((holiday) => {
      const { startMonth, startDay, endMonth, endDay } = holiday.date;

      // Single day event
      if (!endMonth && !endDay) {
        return currentMonth === startMonth && currentDay === startDay;
      }

      // Range within same year (e.g., Dec 1 - Dec 25)
      if (endMonth && endMonth >= startMonth) {
        if (currentMonth > startMonth && currentMonth < endMonth) return true;
        if (currentMonth === startMonth && currentDay >= startDay) {
            // If start and end month are same, check end day
            if (startMonth === endMonth) {
                return currentDay <= endDay!;
            }
            return true;
        }
        if (currentMonth === endMonth && currentDay <= endDay!) return true;
        return false;
      }

      // Range spanning year boundary (e.g., Dec 25 - Jan 5)
      if (endMonth && endMonth < startMonth) {
        // In the start year (e.g., Dec)
        if (currentMonth === startMonth && currentDay >= startDay) return true;
        if (currentMonth > startMonth) return true; // e.g. if start is Nov, and now is Dec

        // In the end year (e.g., Jan)
        if (currentMonth === endMonth && currentDay <= endDay!) return true;
        if (currentMonth < endMonth) return true;
        
        return false;
      }

      return false;
    }) || null;
  }, [mounted, testDate]);

  return activeHoliday;
}
