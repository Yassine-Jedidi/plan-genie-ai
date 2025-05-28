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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }
): string {
  const date = utcToLocal(dateString);
  if (!date) return 'No date';
  
  // Check if time formatting is needed
  const hasTimeOptions = options.hour !== undefined || options.minute !== undefined;
  
  // Format the date part
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: options.year,
    month: options.month,
    day: options.day,
    weekday: options.weekday
  });
  
  // If no time is needed, return just the date
  if (!hasTimeOptions) {
    return dateFormatter.format(date);
  }
  
  // Format the time part
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: options.hour,
    minute: options.minute,
    hour12: options.hour12
  });
  
  // Combine date and time with a space instead of "at"
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
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
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
