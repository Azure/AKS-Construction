"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRangeTypeToUse = void 0;
var dateValues_1 = require("../dateValues/dateValues");
var isContiguous_1 = require("./isContiguous");
/**
 * Return corrected date range type, given `dateRangeType` and list of working days.
 * For non-contiguous working days and working week range type, returns general week range type.
 * For other cases returns input date range type.
 * @param dateRangeType - input type of range
 * @param workWeekDays - list of working days in a week
 */
var getDateRangeTypeToUse = function (dateRangeType, workWeekDays, firstDayOfWeek) {
    if (workWeekDays && dateRangeType === dateValues_1.DateRangeType.WorkWeek) {
        if (!isContiguous_1.isContiguous(workWeekDays, true, firstDayOfWeek) || workWeekDays.length === 0) {
            return dateValues_1.DateRangeType.Week;
        }
    }
    return dateRangeType;
};
exports.getDateRangeTypeToUse = getDateRangeTypeToUse;
//# sourceMappingURL=getDateRangeTypeToUse.js.map