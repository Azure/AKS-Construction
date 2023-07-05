import { __assign } from "tslib";
/**
 * Format date to a day string representation
 * @param date - input date to format
 */
export var formatDay = function (date) { return date.getDate().toString(); };
/**
 * Format date to a month-day-year string
 * @param date - input date to format
 * @param strings - localized strings
 */
export var formatMonthDayYear = function (date, strings) {
    return strings.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
};
/**
 * Format date to a month-year string
 * @param date - input date to format
 * @param strings - localized strings
 */
export var formatMonthYear = function (date, strings) {
    return strings.months[date.getMonth()] + ' ' + date.getFullYear();
};
/**
 * Format date to a month string
 * @param date - input date to format
 * @param strings - localized strings
 */
export var formatMonth = function (date, strings) { return strings.months[date.getMonth()]; };
/**
 * Format date to a year string representation
 * @param date - input date to format
 */
export var formatYear = function (date) { return date.getFullYear().toString(); };
export var DEFAULT_DATE_GRID_STRINGS = {
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};
export var DEFAULT_DATE_FORMATTING = {
    formatDay: formatDay,
    formatMonth: formatMonth,
    formatYear: formatYear,
    formatMonthDayYear: formatMonthDayYear,
    formatMonthYear: formatMonthYear,
};
export var DEFAULT_CALENDAR_STRINGS = __assign(__assign({}, DEFAULT_DATE_GRID_STRINGS), { goToToday: 'Go to today', weekNumberFormatString: 'Week number {0}', prevMonthAriaLabel: 'Previous month', nextMonthAriaLabel: 'Next month', prevYearAriaLabel: 'Previous year', nextYearAriaLabel: 'Next year', prevYearRangeAriaLabel: 'Previous year range', nextYearRangeAriaLabel: 'Next year range', closeButtonAriaLabel: 'Close', selectedDateFormatString: 'Selected date {0}', todayDateFormatString: "Today's date {0}", monthPickerHeaderAriaLabel: '{0}, change year', yearPickerHeaderAriaLabel: '{0}, change month', dayMarkedAriaLabel: 'marked' });
//# sourceMappingURL=dateFormatting.defaults.js.map