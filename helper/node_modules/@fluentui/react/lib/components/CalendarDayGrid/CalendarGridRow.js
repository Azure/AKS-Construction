import { __assign } from "tslib";
import * as React from 'react';
import { format } from '@fluentui/utilities';
import { getWeekNumbersInMonth } from '@fluentui/date-time-utilities';
import { CalendarGridDayCell } from './CalendarGridDayCell';
export var CalendarGridRow = function (props) {
    var classNames = props.classNames, week = props.week, weeks = props.weeks, weekIndex = props.weekIndex, rowClassName = props.rowClassName, ariaRole = props.ariaRole, showWeekNumbers = props.showWeekNumbers, firstDayOfWeek = props.firstDayOfWeek, firstWeekOfYear = props.firstWeekOfYear, navigatedDate = props.navigatedDate, strings = props.strings;
    var weekNumbers = showWeekNumbers
        ? getWeekNumbersInMonth(weeks.length, firstDayOfWeek, firstWeekOfYear, navigatedDate)
        : null;
    var titleString = weekNumbers
        ? strings.weekNumberFormatString && format(strings.weekNumberFormatString, weekNumbers[weekIndex])
        : '';
    return (React.createElement("tr", { role: ariaRole, className: rowClassName, key: weekIndex + '_' + week[0].key },
        showWeekNumbers && weekNumbers && (React.createElement("th", { className: classNames.weekNumberCell, key: weekIndex, title: titleString, "aria-label": titleString, scope: "row" },
            React.createElement("span", null, weekNumbers[weekIndex]))),
        week.map(function (day, dayIndex) { return (React.createElement(CalendarGridDayCell, __assign({}, props, { key: day.key, day: day, dayIndex: dayIndex }))); })));
};
//# sourceMappingURL=CalendarGridRow.js.map