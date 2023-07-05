define(["require", "exports", "../dateMath/dateMath", "./isBeforeMinDate", "./isAfterMaxDate"], function (require, exports, dateMath_1, isBeforeMinDate_1, isAfterMaxDate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isRestrictedDate = void 0;
    /**
     * Checks if `date` falls into the restricted `options`
     * @param date - date to check
     * @param options - restriction options (min date, max date and list of restricted dates)
     */
    var isRestrictedDate = function (date, options) {
        var restrictedDates = options.restrictedDates, minDate = options.minDate, maxDate = options.maxDate;
        if (!restrictedDates && !minDate && !maxDate) {
            return false;
        }
        var inRestrictedDates = restrictedDates && restrictedDates.some(function (rd) { return dateMath_1.compareDates(rd, date); });
        return inRestrictedDates || isBeforeMinDate_1.isBeforeMinDate(date, options) || isAfterMaxDate_1.isAfterMaxDate(date, options);
    };
    exports.isRestrictedDate = isRestrictedDate;
});
//# sourceMappingURL=isRestrictedDate.js.map