import * as React from 'react';
import { classNamesFunction } from '../../../Utilities';
import { getStyles } from './Beak.styles';
import { RectangleEdge } from '../../../Positioning';
export var BEAK_HEIGHT = 10;
export var BEAK_WIDTH = 18;
export var Beak = React.forwardRef(function (props, forwardedRef) {
    var left = props.left, top = props.top, bottom = props.bottom, right = props.right, color = props.color, _a = props.direction, direction = _a === void 0 ? RectangleEdge.top : _a;
    var svgHeight;
    var svgWidth;
    if (direction === RectangleEdge.top || direction === RectangleEdge.bottom) {
        svgHeight = BEAK_HEIGHT;
        svgWidth = BEAK_WIDTH;
    }
    else {
        svgHeight = BEAK_WIDTH;
        svgWidth = BEAK_HEIGHT;
    }
    var pointOne;
    var pointTwo;
    var pointThree;
    var transform;
    switch (direction) {
        case RectangleEdge.top:
        default:
            pointOne = BEAK_WIDTH / 2 + ", 0";
            pointTwo = BEAK_WIDTH + ", " + BEAK_HEIGHT;
            pointThree = "0, " + BEAK_HEIGHT;
            transform = 'translateY(-100%)';
            break;
        case RectangleEdge.right:
            pointOne = "0, 0";
            pointTwo = BEAK_HEIGHT + ", " + BEAK_HEIGHT;
            pointThree = "0, " + BEAK_WIDTH;
            transform = 'translateX(100%)';
            break;
        case RectangleEdge.bottom:
            pointOne = "0, 0";
            pointTwo = BEAK_WIDTH + ", 0";
            pointThree = BEAK_WIDTH / 2 + ", " + BEAK_HEIGHT;
            transform = 'translateY(100%)';
            break;
        case RectangleEdge.left:
            pointOne = BEAK_HEIGHT + ", 0";
            pointTwo = "0, " + BEAK_HEIGHT;
            pointThree = BEAK_HEIGHT + ", " + BEAK_WIDTH;
            transform = 'translateX(-100%)';
            break;
    }
    var getClassNames = classNamesFunction();
    var classNames = getClassNames(getStyles, {
        left: left,
        top: top,
        bottom: bottom,
        right: right,
        height: svgHeight + "px",
        width: svgWidth + "px",
        transform: transform,
        color: color,
    });
    return (React.createElement("div", { className: classNames.root, role: "presentation", ref: forwardedRef },
        React.createElement("svg", { height: svgHeight, width: svgWidth, className: classNames.beak },
            React.createElement("polygon", { points: pointOne + ' ' + pointTwo + ' ' + pointThree }))));
});
Beak.displayName = 'Beak';
//# sourceMappingURL=Beak.js.map