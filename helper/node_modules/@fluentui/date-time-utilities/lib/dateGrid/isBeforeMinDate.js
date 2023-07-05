import { compareDatePart } from '../dateMath/dateMath';
/**
 * Checks if `date` happens earlier than min date
 * @param date - date to check
 * @param options - object with min date to check against
 */
export var isBeforeMinDate = function (date, options) {
    var minDate = options.minDate;
    return minDate ? compareDatePart(minDate, date) >= 1 : false;
};
//# sourceMappingURL=isBeforeMinDate.js.map