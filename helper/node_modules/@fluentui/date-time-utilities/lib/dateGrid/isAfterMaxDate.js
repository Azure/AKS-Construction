import { compareDatePart } from '../dateMath/dateMath';
/**
 * Checks if `date` happens later than max date
 * @param date - date to check
 * @param options - object with max date to check against
 */
export var isAfterMaxDate = function (date, options) {
    var maxDate = options.maxDate;
    return maxDate ? compareDatePart(date, maxDate) >= 1 : false;
};
//# sourceMappingURL=isAfterMaxDate.js.map