import * as React from 'react';
import { classNamesFunction } from '../../../Utilities';
var getClassNames = classNamesFunction();
export var ShimmerCircleBase = function (props) {
    // eslint-disable-next-line deprecation/deprecation
    var height = props.height, styles = props.styles, borderStyle = props.borderStyle, theme = props.theme;
    var classNames = getClassNames(styles, {
        theme: theme,
        height: height,
        borderStyle: borderStyle,
    });
    return (React.createElement("div", { className: classNames.root },
        React.createElement("svg", { viewBox: "0 0 10 10", width: height, height: height, className: classNames.svg },
            React.createElement("path", { d: "M0,0 L10,0 L10,10 L0,10 L0,0 Z M0,5 C0,7.76142375 2.23857625,10 5,10 C7.76142375,10 10,7.76142375 10,5 C10,2.23857625 7.76142375,2.22044605e-16 5,0 C2.23857625,-2.22044605e-16 0,2.23857625 0,5 L0,5 Z" }))));
};
//# sourceMappingURL=ShimmerCircle.base.js.map