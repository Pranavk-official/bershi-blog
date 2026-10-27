import { useState, useEffect } from "react";

interface CountdownTarget {
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export function useCountdown(target?: CountdownTarget) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!target) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      let targetDate = new Date(
        currentYear,
        target.month - 1,
        target.day,
        target.hour,
        target.minute
      );

      // If target has passed for this year, aim for next year
      // BUT, for New Year's specifically, if we are in Dec, we want next year's Jan 1.
      // If we are in Jan, we might have just passed it.
      
      // Logic: If target is Jan 1, and today is Dec 25, target is next year.
      // If target is Jan 1, and today is Jan 2, target is next year.
      // If target is Dec 25, and today is Dec 20, target is this year.
      
      if (targetDate.getTime() < now.getTime()) {
         // If the target date is in the past, check if it's just expired (e.g. within last 24h) or needs to be next year
         // For a countdown, we usually want the *upcoming* event.
         targetDate.setFullYear(currentYear + 1);
      }
      
      // Special case for New Year's Eve (Dec -> Jan transition)
      // If we are in Dec, and target is Jan, we want next year.
      if (now.getMonth() === 11 && target.month === 1) {
          targetDate = new Date(currentYear + 1, 0, 1, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      
      setTimeLeft(diff);
      setIsExpired(diff <= 0);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return "0d 0h 0m 0s";
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return { timeLeft, isExpired, formatTime };
}
