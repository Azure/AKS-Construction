import * as React from 'react';
import { classNamesFunction } from '../../Utilities';
var getClassNames = classNamesFunction();
export var VerticalDividerBase = React.forwardRef(function (props, ref) {
    // eslint-disable-next-line deprecation/deprecation
    var styles = props.styles, theme = props.theme, deprecatedGetClassNames = props.getClassNames, className = props.className;
    var classNames = getClassNames(styles, { theme: theme, getClassNames: deprecatedGetClassNames, className: className });
    return (React.createElement("span", { className: classNames.wrapper, ref: ref },
        React.createElement("span", { className: classNames.divider })));
});
VerticalDividerBase.displayName = 'VerticalDividerBase';
//# sourceMappingURL=VerticalDivider.base.js.map