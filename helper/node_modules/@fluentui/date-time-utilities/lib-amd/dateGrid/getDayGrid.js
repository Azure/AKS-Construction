define(["require", "exports", "../dateMath/dateMath", "../dateValues/dateValues", "./getDateRangeTypeToUse", "./getBoundedDateRange", "./isRestrictedDate"], function (require, exports, dateMath_1, dateValues_1, getDateRangeTypeToUse_1, getBoundedDateRange_1, isRestrictedDate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDayGrid = void 0;
    /**
     * Generates a grid of days, given the `options`.
     * Returns one additional week at the begining from the previous range
     * and one at the end from the future range
     * @param options - parameters to specify date related restrictions for the resulting grid
     */
    var getDayGrid = function (options) {
        var selectedDate = options.selectedDate, dateRangeType = options.dateRangeType, firstDayOfWeek = options.firstDayOfWeek, today = options.today, minDate = options.minDate, maxDate = options.maxDate, weeksToShow = options.weeksToShow, workWeekDays = options.workWeekDays, daysToSelectInDayView = options.daysToSelectInDayView, restrictedDates = options.restrictedDates, markedDays = options.markedDays;
        var restrictedDateOptions = { minDate: minDate, maxDate: maxDate, restrictedDates: restrictedDates };
        var todaysDate = today || new Date();
        var navigatedDate = options.navigatedDate ? options.navigatedDate : todaysDate;
        var date;
        if (weeksToShow && weeksToShow <= 4) {
            // if showing less than a full month, just use date == navigatedDate
            date = new Date(navigatedDate.getFullYear(), navigatedDate.getMonth(), navigatedDate.getDate());
        }
        else {
            date = new Date(navigatedDate.getFullYear(), navigatedDate.getMonth(), 1);
        }
        var weeks = [];
        // Cycle the date backwards to get to the first day of the week.
        while (date.getDay() !== firstDayOfWeek) {
            date.setDate(date.getDate() - 1);
        }
        // add the transition week as last week of previous range
        date = dateMath_1.addDays(date, -dateValues_1.DAYS_IN_WEEK);
        // a flag to indicate whether all days of the week are outside the month
        var isAllDaysOfWeekOutOfMonth = false;
        // in work week view if the days aren't contiguous we use week view instead
        var selectedDateRangeType = getDateRangeTypeToUse_1.getDateRangeTypeToUse(dateRangeType, workWeekDays, firstDayOfWeek);
        var selectedDates = [];
        if (selectedDate) {
            selectedDates = dateMath_1.getDateRangeArray(selectedDate, selectedDateRangeType, firstDayOfWeek, workWeekDays, daysToSelectInDayView);
            selectedDates = getBoundedDateRange_1.getBoundedDateRange(selectedDates, minDate, maxDate);
        }
        var shouldGetWeeks = true;
        for (var weekIndex = 0; shouldGetWeeks; weekIndex++) {
            var week = [];
            isAllDaysOfWeekOutOfMonth = true;
            var _loop_1 = function (dayIndex) {
                var originalDate = new Date(date.getTime());
                var dayInfo = {
                    key: date.toString(),
                    date: date.getDate().toString(),
                    originalDate: originalDate,
                    isInMonth: date.getMonth() === navigatedDate.getMonth(),
                    isToday: dateMath_1.compareDates(todaysDate, date),
                    isSelected: dateMath_1.isInDateRangeArray(date, selectedDates),
                    isInBounds: !isRestrictedDate_1.isRestrictedDate(date, restrictedDateOptions),
                    isMarked: (markedDays === null || markedDays === void 0 ? void 0 : markedDays.some(function (markedDay) { return dateMath_1.compareDates(originalDate, markedDay); })) || false,
                };
                week.push(dayInfo);
                if (dayInfo.isInMonth) {
                    isAllDaysOfWeekOutOfMonth = false;
                }
                date.setDate(date.getDate() + 1);
            };
            for (var dayIndex = 0; dayIndex < dateValues_1.DAYS_IN_WEEK; dayIndex++) {
                _loop_1(dayIndex);
            }
            // We append the condition of the loop depending upon the showSixWeeksByDefault prop.
            shouldGetWeeks = weeksToShow ? weekIndex < weeksToShow + 1 : !isAllDaysOfWeekOutOfMonth || weekIndex === 0;
            // we don't check shouldGetWeeks before pushing because we want to add one extra week for transition state
            weeks.push(week);
        }
        return weeks;
    };
    exports.getDayGrid = getDayGrid;
});
//# sourceMappingURL=getDayGrid.js.map