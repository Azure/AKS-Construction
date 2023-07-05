import * as React from 'react';
import { useCallback } from 'react';
import { classNamesFunction } from '../../Utilities';
import { Link } from '../../Link';
import { GroupSpacer } from './GroupSpacer';
var getClassNames = classNamesFunction();
export var GroupShowAllBase = function (props) {
    var group = props.group, groupLevel = props.groupLevel, _a = props.showAllLinkText, showAllLinkText = _a === void 0 ? 'Show All' : _a, styles = props.styles, theme = props.theme, onToggleSummarize = props.onToggleSummarize;
    var classNames = getClassNames(styles, { theme: theme });
    var memoizedOnClick = useCallback(function (ev) {
        onToggleSummarize(group);
        ev.stopPropagation();
        ev.preventDefault();
    }, [onToggleSummarize, group]);
    if (group) {
        return (React.createElement("div", { className: classNames.root },
            React.createElement(GroupSpacer, { count: groupLevel }),
            React.createElement(Link, { onClick: memoizedOnClick }, showAllLinkText)));
    }
    return null;
};
//# sourceMappingURL=GroupShowAll.base.js.map