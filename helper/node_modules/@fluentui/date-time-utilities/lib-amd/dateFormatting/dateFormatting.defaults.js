define(["require", "exports", "tslib"], function (require, exports, tslib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_CALENDAR_STRINGS = exports.DEFAULT_DATE_FORMATTING = exports.DEFAULT_DATE_GRID_STRINGS = exports.formatYear = exports.formatMonth = exports.formatMonthYear = exports.formatMonthDayYear = exports.formatDay = void 0;
    /**
     * Format date to a day string representation
     * @param date - input date to format
     */
    var formatDay = function (date) { return date.getDate().toString(); };
    exports.formatDay = formatDay;
    /**
     * Format date to a month-day-year string
     * @param date - input date to format
     * @param strings - localized strings
     */
    var formatMonthDayYear = function (date, strings) {
        return strings.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    };
    exports.formatMonthDayYear = formatMonthDayYear;
    /**
     * Format date to a month-year string
     * @param date - input date to format
     * @param strings - localized strings
     */
    var formatMonthYear = function (date, strings) {
        return strings.months[date.getMonth()] + ' ' + date.getFullYear();
    };
    exports.formatMonthYear = formatMonthYear;
    /**
     * Format date to a month string
     * @param date - input date to format
     * @param strings - localized strings
     */
    var formatMonth = function (date, strings) { return strings.months[date.getMonth()]; };
    exports.formatMonth = formatMonth;
    /**
     * Format date to a year string representation
     * @param date - input date to format
     */
    var formatYear = function (date) { return date.getFullYear().toString(); };
    exports.formatYear = formatYear;
    exports.DEFAULT_DATE_GRID_STRINGS = {
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
    exports.DEFAULT_DATE_FORMATTING = {
        formatDay: exports.formatDay,
        formatMonth: exports.formatMonth,
        formatYear: exports.formatYear,
        formatMonthDayYear: exports.formatMonthDayYear,
        formatMonthYear: exports.formatMonthYear,
    };
    exports.DEFAULT_CALENDAR_STRINGS = tslib_1.__assign(tslib_1.__assign({}, exports.DEFAULT_DATE_GRID_STRINGS), { goToToday: 'Go to today', weekNumberFormatString: 'Week number {0}', prevMonthAriaLabel: 'Previous month', nextMonthAriaLabel: 'Next month', prevYearAriaLabel: 'Previous year', nextYearAriaLabel: 'Next year', prevYearRangeAriaLabel: 'Previous year range', nextYearRangeAriaLabel: 'Next year range', closeButtonAriaLabel: 'Close', selectedDateFormatString: 'Selected date {0}', todayDateFormatString: "Today's date {0}", monthPickerHeaderAriaLabel: '{0}, change year', yearPickerHeaderAriaLabel: '{0}, change month', dayMarkedAriaLabel: 'marked' });
});
//# sourceMappingURL=dateFormatting.defaults.js.map