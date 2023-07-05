import * as React from 'react';
import { classNamesFunction } from '../../../Utilities';
var getClassNames = classNamesFunction();
/**
 * {@docCategory Shimmer}
 */
export var ShimmerGapBase = function (props) {
    // eslint-disable-next-line deprecation/deprecation
    var height = props.height, styles = props.styles, _a = props.width, width = _a === void 0 ? '10px' : _a, borderStyle = props.borderStyle, theme = props.theme;
    var classNames = getClassNames(styles, {
        theme: theme,
        height: height,
        borderStyle: borderStyle,
    });
    return (React.createElement("div", { style: { width: width, minWidth: typeof width === 'number' ? width + "px" : 'auto' }, className: classNames.root }));
};
//# sourceMappingURL=ShimmerGap.base.js.map