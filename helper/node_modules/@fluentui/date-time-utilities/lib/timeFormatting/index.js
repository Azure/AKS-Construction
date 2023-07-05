/**
 * Format a date object to a localized time string using the browser's default locale
 * @param date - Input date to format
 * @param showSeconds - Whether to show seconds in the formatted string
 * @param useHour12 - Whether to use 12-hour time
 */
export var formatTimeString = function (date, showSeconds, useHour12) {
    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        second: showSeconds ? '2-digit' : undefined,
        hour12: useHour12,
    });
};
//# sourceMappingURL=index.js.map