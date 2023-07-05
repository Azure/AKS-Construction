import * as React from 'react';
import { classNamesFunction } from '../../Utilities';
import { GroupSpacer } from './GroupSpacer';
var getClassNames = classNamesFunction();
export var GroupFooterBase = function (props) {
    var group = props.group, groupLevel = props.groupLevel, footerText = props.footerText, indentWidth = props.indentWidth, styles = props.styles, theme = props.theme;
    var classNames = getClassNames(styles, { theme: theme });
    if (group && footerText) {
        return (React.createElement("div", { className: classNames.root },
            React.createElement(GroupSpacer, { indentWidth: indentWidth, count: groupLevel }),
            footerText));
    }
    return null;
};
//# sourceMappingURL=GroupFooter.base.js.map