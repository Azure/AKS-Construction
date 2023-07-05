import * as React from 'react';
import { classNamesFunction } from '../../Utilities';
var getClassNames = classNamesFunction();
export var SeparatorBase = React.forwardRef(function (props, ref) {
    var styles = props.styles, theme = props.theme, className = props.className, vertical = props.vertical, alignContent = props.alignContent, children = props.children;
    var classNames = getClassNames(styles, {
        theme: theme,
        className: className,
        alignContent: alignContent,
        vertical: vertical,
    });
    return (React.createElement("div", { className: classNames.root, ref: ref },
        React.createElement("div", { className: classNames.content, role: "separator", "aria-orientation": vertical ? 'vertical' : 'horizontal' }, children)));
});
//# sourceMappingURL=Separator.base.js.map