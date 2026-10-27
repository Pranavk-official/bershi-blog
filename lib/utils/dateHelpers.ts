import { isWithinInterval } from "date-fns";
import { CHRISTMAS_SEASON, NEW_YEAR_SEASON } from "@/lib/constants";

/**
 * Date helper utilities
 */

/**
 * Checks if the current date falls within the Christmas season
 * Uses the date range configured in constants
 * 
 * @returns true if current date is within Christmas season, false otherwise
 */
export function isChristmasSeason(): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();

  const startDate = new Date(
    currentYear,
    CHRISTMAS_SEASON.START_MONTH - 1, // Months are 0-indexed in JS
    CHRISTMAS_SEASON.START_DAY
  );

  const endDate = new Date(
    currentYear,
    CHRISTMAS_SEASON.END_MONTH - 1,
    CHRISTMAS_SEASON.END_DAY,
    23, // End of the day
    59,
    59
  );

  return isWithinInterval(now, { start: startDate, end: endDate });
}

/**
 * Checks if the current date falls within the New Year season
 * Uses the date range configured in constants
 * 
 * @returns true if current date is within New Year season, false otherwise
 */
export function isNewYearSeason(): boolean {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Check if we are in the December part of the season
  if (month === NEW_YEAR_SEASON.START_MONTH && day >= NEW_YEAR_SEASON.START_DAY) {
    return true;
  }

  // Check if we are in the January part of the season
  if (month === NEW_YEAR_SEASON.END_MONTH && day <= NEW_YEAR_SEASON.END_DAY) {
    return true;
  }

  return false;
}

/**
 * Gets the time remaining until New Year (Jan 1st 00:00:00)
 * 
 * @returns Milliseconds until New Year (negative if passed)
 */
export function getTimeUntilNewYear(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // If we are in January, the target was this year's Jan 1st
  // If we are in December, the target is next year's Jan 1st
  const targetYear = now.getMonth() === 0 ? currentYear : currentYear + 1;
  
  const newYear = new Date(targetYear, 0, 1, 0, 0, 0);
  return newYear.getTime() - now.getTime();
}

/**
 * Gets the number of days until Christmas
 * 
 * @returns Number of days until December 25th (0 if today is Dec 25)
 */
export function getDaysUntilChristmas(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const christmas = new Date(currentYear, 11, 25); // December 25

  // If Christmas has passed this year, calculate for next year
  if (now > christmas) {
    christmas.setFullYear(currentYear + 1);
  }

  const diffTime = christmas.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Checks if today is Christmas Day (December 25th)
 * 
 * @returns true if today is December 25th
 */
export function isChristmasDay(): boolean {
  const now = new Date();
  return now.getMonth() === 11 && now.getDate() === 25;
}
