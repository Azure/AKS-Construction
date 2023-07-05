"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAvailableDate = void 0;
var tslib_1 = require("tslib");
var isRestrictedDate_1 = require("./isRestrictedDate");
var isAfterMaxDate_1 = require("./isAfterMaxDate");
var isBeforeMinDate_1 = require("./isBeforeMinDate");
var dateMath_1 = require("../dateMath/dateMath");
/**
 * Returns closest available date given the restriction `options`, or undefined otherwise
 * @param options - list of search options
 */
var findAvailableDate = function (options) {
    var targetDate = options.targetDate, initialDate = options.initialDate, direction = options.direction, restrictedDateOptions = tslib_1.__rest(options, ["targetDate", "initialDate", "direction"]);
    var availableDate = targetDate;
    // if the target date is available, return it immediately
    if (!isRestrictedDate_1.isRestrictedDate(targetDate, restrictedDateOptions)) {
        return targetDate;
    }
    while (dateMath_1.compareDatePart(initialDate, availableDate) !== 0 &&
        isRestrictedDate_1.isRestrictedDate(availableDate, restrictedDateOptions) &&
        !isAfterMaxDate_1.isAfterMaxDate(availableDate, restrictedDateOptions) &&
        !isBeforeMinDate_1.isBeforeMinDate(availableDate, restrictedDateOptions)) {
        availableDate = dateMath_1.addDays(availableDate, direction);
    }
    if (dateMath_1.compareDatePart(initialDate, availableDate) !== 0 && !isRestrictedDate_1.isRestrictedDate(availableDate, restrictedDateOptions)) {
        return availableDate;
    }
    return undefined;
};
exports.findAvailableDate = findAvailableDate;
//# sourceMappingURL=findAvailableDate.js.map