import { __assign } from "tslib";
import * as React from 'react';
import { classNamesFunction } from '../../Utilities';
import { TeachingBubbleContent } from './TeachingBubbleContent';
import { Callout } from '../../Callout';
import { DirectionalHint } from '../../common/DirectionalHint';
import { useMergedRefs } from '@fluentui/react-hooks';
var COMPONENT_NAME = 'TeachingBubble';
var defaultCalloutProps = {
    beakWidth: 16,
    gapSpace: 0,
    setInitialFocus: true,
    doNotLayer: false,
    directionalHint: DirectionalHint.rightCenter,
};
var getClassNames = classNamesFunction();
var useComponentRef = function (componentRef, rootElementRef) {
    React.useImperativeHandle(componentRef, function () { return ({
        focus: function () { var _a; return (_a = rootElementRef.current) === null || _a === void 0 ? void 0 : _a.focus(); },
    }); }, [rootElementRef]);
};
export var TeachingBubbleBase = React.forwardRef(function (props, forwardedRef) {
    var rootElementRef = React.useRef(null);
    var mergedRootRef = useMergedRefs(rootElementRef, forwardedRef);
    var setCalloutProps = props.calloutProps, 
    // eslint-disable-next-line deprecation/deprecation
    targetElement = props.targetElement, onDismiss = props.onDismiss, 
    // eslint-disable-next-line deprecation/deprecation
    _a = props.hasCloseButton, 
    // eslint-disable-next-line deprecation/deprecation
    hasCloseButton = _a === void 0 ? props.hasCloseIcon : _a, isWide = props.isWide, styles = props.styles, theme = props.theme, target = props.target;
    var calloutProps = React.useMemo(function () { return (__assign(__assign(__assign({}, defaultCalloutProps), setCalloutProps), { theme: theme })); }, [setCalloutProps, theme]);
    var stylesProps = {
        theme: theme,
        isWide: isWide,
        calloutProps: calloutProps,
        hasCloseButton: hasCloseButton,
    };
    var classNames = getClassNames(styles, stylesProps);
    var calloutStyles = classNames.subComponentStyles
        ? classNames.subComponentStyles.callout
        : undefined;
    useComponentRef(props.componentRef, rootElementRef);
    return (React.createElement(Callout, __assign({ target: target || targetElement, onDismiss: onDismiss }, calloutProps, { className: classNames.root, styles: calloutStyles, hideOverflow: true }),
        React.createElement("div", { ref: mergedRootRef },
            React.createElement(TeachingBubbleContent, __assign({}, props)))));
});
TeachingBubbleBase.displayName = COMPONENT_NAME;
//# sourceMappingURL=TeachingBubble.base.js.map