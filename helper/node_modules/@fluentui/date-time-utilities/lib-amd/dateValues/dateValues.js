define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DAYS_IN_WEEK = exports.DateRangeType = exports.FirstWeekOfYear = exports.MonthOfYear = exports.DayOfWeek = void 0;
    /**
     * The days of the week
     * {@docCategory DateTimeUtilities}
     */
    var DayOfWeek;
    (function (DayOfWeek) {
        DayOfWeek[DayOfWeek["Sunday"] = 0] = "Sunday";
        DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
        DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
        DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
        DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
        DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
        DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
    })(DayOfWeek = exports.DayOfWeek || (exports.DayOfWeek = {}));
    /**
     * The months
     * {@docCategory DateTimeUtilities}
     */
    var MonthOfYear;
    (function (MonthOfYear) {
        MonthOfYear[MonthOfYear["January"] = 0] = "January";
        MonthOfYear[MonthOfYear["February"] = 1] = "February";
        MonthOfYear[MonthOfYear["March"] = 2] = "March";
        MonthOfYear[MonthOfYear["April"] = 3] = "April";
        MonthOfYear[MonthOfYear["May"] = 4] = "May";
        MonthOfYear[MonthOfYear["June"] = 5] = "June";
        MonthOfYear[MonthOfYear["July"] = 6] = "July";
        MonthOfYear[MonthOfYear["August"] = 7] = "August";
        MonthOfYear[MonthOfYear["September"] = 8] = "September";
        MonthOfYear[MonthOfYear["October"] = 9] = "October";
        MonthOfYear[MonthOfYear["November"] = 10] = "November";
        MonthOfYear[MonthOfYear["December"] = 11] = "December";
    })(MonthOfYear = exports.MonthOfYear || (exports.MonthOfYear = {}));
    /**
     * First week of the year settings types
     * {@docCategory DateTimeUtilities}
     */
    var FirstWeekOfYear;
    (function (FirstWeekOfYear) {
        FirstWeekOfYear[FirstWeekOfYear["FirstDay"] = 0] = "FirstDay";
        FirstWeekOfYear[FirstWeekOfYear["FirstFullWeek"] = 1] = "FirstFullWeek";
        FirstWeekOfYear[FirstWeekOfYear["FirstFourDayWeek"] = 2] = "FirstFourDayWeek";
    })(FirstWeekOfYear = exports.FirstWeekOfYear || (exports.FirstWeekOfYear = {}));
    /**
     * The supported date range types
     * {@docCategory DateTimeUtilities}
     */
    var DateRangeType;
    (function (DateRangeType) {
        DateRangeType[DateRangeType["Day"] = 0] = "Day";
        DateRangeType[DateRangeType["Week"] = 1] = "Week";
        DateRangeType[DateRangeType["Month"] = 2] = "Month";
        DateRangeType[DateRangeType["WorkWeek"] = 3] = "WorkWeek";
    })(DateRangeType = exports.DateRangeType || (exports.DateRangeType = {}));
    exports.DAYS_IN_WEEK = 7;
});
//# sourceMappingURL=dateValues.js.map