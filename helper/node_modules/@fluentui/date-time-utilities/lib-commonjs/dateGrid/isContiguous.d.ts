import { DayOfWeek } from '../dateValues/dateValues';
/**
 * Returns whether provided week days are contiguous.
 * @param days - list of days in a week
 * @param isSingleWeek - decides whether the contiguous logic applies across week boundaries or not
 * @param firstDayOfWeek - decides which day of week is the first one in the order.
 */
export declare const isContiguous: (days: DayOfWeek[], isSingleWeek: boolean, firstDayOfWeek: DayOfWeek) => boolean;
