import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isChristmasHoliday() {
  const today = new Date();
  return today.getMonth() === 11 && today.getDate() >= 24 && today.getDate() <= 26;
}
