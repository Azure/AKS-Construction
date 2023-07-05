import { DayOfWeek, FirstWeekOfYear, DateRangeType } from '../dateValues/dateValues';
/**
 * Returns a date offset from the given date by the specified number of days.
 * @param date - The origin date
 * @param days - The number of days to offset. 'days' can be negative.
 * @returns A new Date object offset from the origin date by the given number of days
 */
export declare function addDays(date: Date, days: number): Date;
/**
 * Returns a date offset from the given date by the specified number of weeks.
 * @param date - The origin date
 * @param weeks - The number of weeks to offset. 'weeks' can be negative.
 * @returns A new Date object offset from the origin date by the given number of weeks
 */
export declare function addWeeks(date: Date, weeks: number): Date;
/**
 * Returns a date offset from the given date by the specified number of months.
 * The method tries to preserve the day-of-month; however, if the new month does not have enough days
 * to contain the original day-of-month, we'll use the last day of the new month.
 * @param date - The origin date
 * @param months - The number of months to offset. 'months' can be negative.
 * @returns A new Date object offset from the origin date by the given number of months
 */
export declare function addMonths(date: Date, months: number): Date;
/**
 * Returns a date offset from the given date by the specified number of years.
 * The method tries to preserve the day-of-month; however, if the new month does not have enough days
 * to contain the original day-of-month, we'll use the last day of the new month.
 * @param date - The origin date
 * @param years - The number of years to offset. 'years' can be negative.
 * @returns A new Date object offset from the origin date by the given number of years
 */
export declare function addYears(date: Date, years: number): Date;
/**
 * Returns a date that is the first day of the month of the provided date.
 * @param date - The origin date
 * @returns A new Date object with the day set to the first day of the month.
 */
export declare function getMonthStart(date: Date): Date;
/**
 * Returns a date that is the last day of the month of the provided date.
 * @param date - The origin date
 * @returns A new Date object with the day set to the last day of the month.
 */
export declare function getMonthEnd(date: Date): Date;
/**
 * Returns a date that is the first day of the year of the provided date.
 * @param date - The origin date
 * @returns A new Date object with the day set to the first day of the year.
 */
export declare function getYearStart(date: Date): Date;
/**
 * Returns a date that is the last day of the year of the provided date.
 * @param date - The origin date
 * @returns A new Date object with the day set to the last day of the year.
 */
export declare function getYearEnd(date: Date): Date;
/**
 * Returns a date that is a copy of the given date, aside from the month changing to the given month.
 *  The method tries to preserve the day-of-month; however, if the new month does not have enough days
 * to contain the original day-of-month, we'll use the last day of the new month.
 * @param date - The origin date
 * @param month - The 0-based index of the month to set on the date.
 * @returns A new Date object with the given month set.
 */
export declare function setMonth(date: Date, month: number): Date;
/**
 * Compares two dates, and returns true if the two dates (not accounting for time-of-day) are equal.
 * @returns True if the two dates represent the same date (regardless of time-of-day), false otherwise.
 */
export declare function compareDates(date1: Date, date2: Date): boolean;
/**
 * Compare the date parts of two dates
 * @param date1 - The first date to compare
 * @param date2 - The second date to compare
 * @returns A negative value if date1 is earlier than date2, 0 if the dates are equal, or a positive value
 * if date1 is later than date2.
 */
export declare function compareDatePart(date1: Date, date2: Date): Number;
/**
 * Gets the date range array including the specified date. The date range array is calculated as the list
 * of dates accounting for the specified first day of the week and date range type.
 * @param date - The input date
 * @param dateRangeType - The desired date range type, i.e., day, week, month, etc.
 * @param firstDayOfWeek - The first day of the week.
 * @param workWeekDays - The allowed days in work week. If not provided, assumes all days are allowed.
 * @param daysToSelectInDayView - The number of days to include when using dateRangeType === DateRangeType.Day
 * for multiday view. Defaults to 1
 * @returns An array of dates representing the date range containing the specified date.
 */
export declare function getDateRangeArray(date: Date, dateRangeType: DateRangeType, firstDayOfWeek: DayOfWeek, workWeekDays?: DayOfWeek[], daysToSelectInDayView?: number): Date[];
/**
 * Checks whether the specified date is in the given date range.
 * @param date - The origin date
 * @param dateRange - An array of dates to do the lookup on
 * @returns True if the date matches one of the dates in the specified array, false otherwise.
 */
export declare function isInDateRangeArray(date: Date, dateRange: Date[]): boolean;
/**
 * Returns the week number for a date.
 * Week numbers are 1 - 52 (53) in a year
 * @param navigatedDate - A date to find the week number for.
 * @param firstDayOfWeek - The first day of the week (0-6, Sunday = 0)
 * @param firstWeekOfYear - The first week of the year (1-2)
 * @returns The weeks number array for the current month.
 */
export declare function getWeekNumbersInMonth(weeksInMonth: number, firstDayOfWeek: DayOfWeek, firstWeekOfYear: FirstWeekOfYear, navigatedDate: Date): number[];
/**
 * Returns the week number for a date.
 * Week numbers are 1 - 52 (53) in a year
 * @param date - A date to find the week number for.
 * @param firstDayOfWeek - The first day of the week (0-6, Sunday = 0)
 * @param firstWeekOfYear - The first week of the year (1-2)
 * @returns The week's number in the year.
 */
export declare function getWeekNumber(date: Date, firstDayOfWeek: DayOfWeek, firstWeekOfYear: FirstWeekOfYear): number;
/**
 * Gets the date for the first day of the week based on the given date assuming
 * the specified first day of the week.
 * @param date - The date to find the beginning of the week date for.
 * @returns A new date object representing the first day of the week containing the input date.
 */
export declare function getStartDateOfWeek(date: Date, firstDayOfWeek: DayOfWeek): Date;
/**
 * Gets the date for the last day of the week based on the given date assuming
 * the specified first day of the week.
 * @param date - The date to find the beginning of the week date for.
 * @returns A new date object representing the first day of the week containing the input date.
 */
export declare function getEndDateOfWeek(date: Date, firstDayOfWeek: DayOfWeek): Date;
/**
 * Helper function to assist in date comparisons
 */
export declare function getDatePartHashValue(date: Date): number;
