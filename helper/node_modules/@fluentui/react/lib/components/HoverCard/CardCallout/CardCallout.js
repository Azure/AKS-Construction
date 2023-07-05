import { __assign } from "tslib";
import * as React from 'react';
import { divProperties, getNativeProps } from '../../../Utilities';
import { DirectionalHint } from '../../../common/DirectionalHint';
import { Callout, FocusTrapCallout } from '../../../Callout';
export var CardCallout = function (props) {
    var _a = props.gapSpace, gapSpace = _a === void 0 ? 0 : _a, _b = props.directionalHint, directionalHint = _b === void 0 ? DirectionalHint.bottomLeftEdge : _b, directionalHintFixed = props.directionalHintFixed, targetElement = props.targetElement, firstFocus = props.firstFocus, trapFocus = props.trapFocus, onLeave = props.onLeave, className = props.className, finalHeight = props.finalHeight, content = props.content, calloutProps = props.calloutProps;
    var mergedCalloutProps = __assign(__assign(__assign({}, getNativeProps(props, divProperties)), { className: className, target: targetElement, isBeakVisible: false, directionalHint: directionalHint, directionalHintFixed: directionalHintFixed, finalHeight: finalHeight, minPagePadding: 24, onDismiss: onLeave, gapSpace: gapSpace }), calloutProps);
    return (React.createElement(React.Fragment, null, trapFocus ? (React.createElement(FocusTrapCallout, __assign({}, mergedCalloutProps, { focusTrapProps: {
            forceFocusInsideTrap: false,
            isClickableOutsideFocusTrap: true,
            disableFirstFocus: !firstFocus,
        } }), content)) : (React.createElement(Callout, __assign({}, mergedCalloutProps), content))));
};
//# sourceMappingURL=CardCallout.js.map