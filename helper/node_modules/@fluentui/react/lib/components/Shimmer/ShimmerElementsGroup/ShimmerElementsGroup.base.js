import { __assign, __rest } from "tslib";
import * as React from 'react';
import { classNamesFunction, memoizeFunction } from '../../../Utilities';
import { ShimmerElementType, ShimmerElementsDefaultHeights } from '../Shimmer.types';
import { ShimmerLine } from '../ShimmerLine/ShimmerLine';
import { ShimmerGap } from '../ShimmerGap/ShimmerGap';
import { ShimmerCircle } from '../ShimmerCircle/ShimmerCircle';
var getClassNames = classNamesFunction();
/**
 * {@docCategory Shimmer}
 */
export var ShimmerElementsGroupBase = function (props) {
    var styles = props.styles, _a = props.width, width = _a === void 0 ? 'auto' : _a, shimmerElements = props.shimmerElements, _b = props.rowHeight, rowHeight = _b === void 0 ? findMaxElementHeight(shimmerElements || []) : _b, _c = props.flexWrap, flexWrap = _c === void 0 ? false : _c, theme = props.theme, backgroundColor = props.backgroundColor;
    var classNames = getClassNames(styles, {
        theme: theme,
        flexWrap: flexWrap,
    });
    return (React.createElement("div", { style: { width: width }, className: classNames.root }, getRenderedElements(shimmerElements, backgroundColor, rowHeight)));
};
function getRenderedElements(shimmerElements, backgroundColor, rowHeight) {
    var renderedElements = shimmerElements ? (shimmerElements.map(
    // false positive
    // eslint-disable-next-line array-callback-return
    function (element, index) {
        var type = element.type, filteredElem = __rest(element, ["type"]);
        var verticalAlign = filteredElem.verticalAlign, height = filteredElem.height;
        var styles = getElementStyles(verticalAlign, type, height, backgroundColor, rowHeight);
        switch (element.type) {
            case ShimmerElementType.circle:
                return React.createElement(ShimmerCircle, __assign({ key: index }, filteredElem, { styles: styles }));
            case ShimmerElementType.gap:
                return React.createElement(ShimmerGap, __assign({ key: index }, filteredElem, { styles: styles }));
            case ShimmerElementType.line:
                return React.createElement(ShimmerLine, __assign({ key: index }, filteredElem, { styles: styles }));
        }
    })) : (React.createElement(ShimmerLine, { height: ShimmerElementsDefaultHeights.line }));
    return renderedElements;
}
var getElementStyles = memoizeFunction(function (verticalAlign, elementType, elementHeight, backgroundColor, rowHeight) {
    var dif = rowHeight && elementHeight ? rowHeight - elementHeight : 0;
    var borderStyle;
    if (!verticalAlign || verticalAlign === 'center') {
        borderStyle = {
            borderBottomWidth: (dif ? Math.floor(dif / 2) : 0) + "px",
            borderTopWidth: (dif ? Math.ceil(dif / 2) : 0) + "px",
        };
    }
    else if (verticalAlign && verticalAlign === 'top') {
        borderStyle = {
            borderBottomWidth: dif + "px",
            borderTopWidth: "0px",
        };
    }
    else if (verticalAlign && verticalAlign === 'bottom') {
        borderStyle = {
            borderBottomWidth: "0px",
            borderTopWidth: dif + "px",
        };
    }
    if (backgroundColor) {
        switch (elementType) {
            case ShimmerElementType.circle:
                return {
                    root: __assign(__assign({}, borderStyle), { borderColor: backgroundColor }),
                    svg: { fill: backgroundColor },
                };
            case ShimmerElementType.gap:
                return {
                    root: __assign(__assign({}, borderStyle), { borderColor: backgroundColor, backgroundColor: backgroundColor }),
                };
            case ShimmerElementType.line:
                return {
                    root: __assign(__assign({}, borderStyle), { borderColor: backgroundColor }),
                    topLeftCorner: { fill: backgroundColor },
                    topRightCorner: { fill: backgroundColor },
                    bottomLeftCorner: { fill: backgroundColor },
                    bottomRightCorner: { fill: backgroundColor },
                };
        }
    }
    return {
        root: borderStyle,
    };
});
/**
 * User should not worry to provide which of the elements is the highest so we do the calculation for him.
 * Plus if user forgot to specify the height we assign their defaults.
 */
function findMaxElementHeight(shimmerElements) {
    var shimmerElementsDefaulted = shimmerElements.map(function (element) {
        switch (element.type) {
            case ShimmerElementType.circle:
                if (!element.height) {
                    element.height = ShimmerElementsDefaultHeights.circle;
                }
                break;
            case ShimmerElementType.line:
                if (!element.height) {
                    element.height = ShimmerElementsDefaultHeights.line;
                }
                break;
            case ShimmerElementType.gap:
                if (!element.height) {
                    element.height = ShimmerElementsDefaultHeights.gap;
                }
                break;
        }
        return element;
    });
    var rowHeight = shimmerElementsDefaulted.reduce(function (acc, next) {
        return next.height ? (next.height > acc ? next.height : acc) : acc;
    }, 0);
    return rowHeight;
}
//# sourceMappingURL=ShimmerElementsGroup.base.js.map