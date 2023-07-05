"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContiguous = void 0;
/**
 * Returns whether provided week days are contiguous.
 * @param days - list of days in a week
 * @param isSingleWeek - decides whether the contiguous logic applies across week boundaries or not
 * @param firstDayOfWeek - decides which day of week is the first one in the order.
 */
var isContiguous = function (days, isSingleWeek, firstDayOfWeek) {
    var daySet = new Set(days);
    var amountOfNoNeighbors = 0;
    for (var _i = 0, days_1 = days; _i < days_1.length; _i++) {
        var day = days_1[_i];
        var nextDay = (day + 1) % 7;
        if (!(daySet.has(nextDay) && (!isSingleWeek || firstDayOfWeek !== nextDay))) {
            amountOfNoNeighbors++;
        }
    }
    // In case the full week is provided, then each day has a neighbor
    //, otherwise the last day does not have a neighbor.
    return amountOfNoNeighbors < 2;
};
exports.isContiguous = isContiguous;
//# sourceMappingURL=isContiguous.js.map