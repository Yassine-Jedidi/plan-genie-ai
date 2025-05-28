import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a UTC date string to the user's local timezone
 * @param dateString - ISO date string in UTC
 * @returns Date object in local timezone
 */
export function utcToLocal(dateString: string | null): Date | null {
  if (!dateString) return null;
  
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
}

/**
 * Formats a date for display using the user's locale and timezone
 * @param dateString - ISO date string in UTC
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string in local timezone
 */
export function formatDate(
  dateString: string | null, 
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short'
  }
): string {
  const date = utcToLocal(dateString);
  if (!date) return 'No date';
  
  return new Intl.DateTimeFormat(navigator.language, options).format(date);
}

/**
 * Formats a time-only value from UTC to local timezone
 * @param dateString - ISO date string in UTC
 * @returns Formatted time string in local timezone
 */
export function formatTime(
  dateString: string | null,
  options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }
): string {
  const date = utcToLocal(dateString);
  if (!date) return 'No time';
  
  return new Intl.DateTimeFormat(navigator.language, options).format(date);
}
