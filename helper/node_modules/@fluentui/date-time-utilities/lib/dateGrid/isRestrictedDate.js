import { compareDates } from '../dateMath/dateMath';
import { isBeforeMinDate } from './isBeforeMinDate';
import { isAfterMaxDate } from './isAfterMaxDate';
/**
 * Checks if `date` falls into the restricted `options`
 * @param date - date to check
 * @param options - restriction options (min date, max date and list of restricted dates)
 */
export var isRestrictedDate = function (date, options) {
    var restrictedDates = options.restrictedDates, minDate = options.minDate, maxDate = options.maxDate;
    if (!restrictedDates && !minDate && !maxDate) {
        return false;
    }
    var inRestrictedDates = restrictedDates && restrictedDates.some(function (rd) { return compareDates(rd, date); });
    return inRestrictedDates || isBeforeMinDate(date, options) || isAfterMaxDate(date, options);
};
//# sourceMappingURL=isRestrictedDate.js.map