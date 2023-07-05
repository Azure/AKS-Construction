import { IDateGridStrings, IDateFormatting, ICalendarStrings } from './dateFormatting.types';
/**
 * Format date to a day string representation
 * @param date - input date to format
 */
export declare const formatDay: (date: Date) => string;
/**
 * Format date to a month-day-year string
 * @param date - input date to format
 * @param strings - localized strings
 */
export declare const formatMonthDayYear: (date: Date, strings: IDateGridStrings) => string;
/**
 * Format date to a month-year string
 * @param date - input date to format
 * @param strings - localized strings
 */
export declare const formatMonthYear: (date: Date, strings: IDateGridStrings) => string;
/**
 * Format date to a month string
 * @param date - input date to format
 * @param strings - localized strings
 */
export declare const formatMonth: (date: Date, strings: IDateGridStrings) => string;
/**
 * Format date to a year string representation
 * @param date - input date to format
 */
export declare const formatYear: (date: Date) => string;
export declare const DEFAULT_DATE_GRID_STRINGS: IDateGridStrings;
export declare const DEFAULT_DATE_FORMATTING: IDateFormatting;
export declare const DEFAULT_CALENDAR_STRINGS: ICalendarStrings;
