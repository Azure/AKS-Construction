"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBeforeMinDate = void 0;
var dateMath_1 = require("../dateMath/dateMath");
/**
 * Checks if `date` happens earlier than min date
 * @param date - date to check
 * @param options - object with min date to check against
 */
var isBeforeMinDate = function (date, options) {
    var minDate = options.minDate;
    return minDate ? dateMath_1.compareDatePart(minDate, date) >= 1 : false;
};
exports.isBeforeMinDate = isBeforeMinDate;
//# sourceMappingURL=isBeforeMinDate.js.map