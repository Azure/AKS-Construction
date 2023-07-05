define(["require", "exports", "../dateMath/dateMath"], function (require, exports, dateMath_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAfterMaxDate = void 0;
    /**
     * Checks if `date` happens later than max date
     * @param date - date to check
     * @param options - object with max date to check against
     */
    var isAfterMaxDate = function (date, options) {
        var maxDate = options.maxDate;
        return maxDate ? dateMath_1.compareDatePart(date, maxDate) >= 1 : false;
    };
    exports.isAfterMaxDate = isAfterMaxDate;
});
//# sourceMappingURL=isAfterMaxDate.js.map