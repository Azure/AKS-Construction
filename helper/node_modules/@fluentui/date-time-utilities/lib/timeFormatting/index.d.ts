/**
 * Format a date object to a localized time string using the browser's default locale
 * @param date - Input date to format
 * @param showSeconds - Whether to show seconds in the formatted string
 * @param useHour12 - Whether to use 12-hour time
 */
export declare const formatTimeString: (date: Date, showSeconds?: boolean | undefined, useHour12?: boolean | undefined) => string;
