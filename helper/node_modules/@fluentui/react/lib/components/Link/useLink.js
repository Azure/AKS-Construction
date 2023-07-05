import { __assign, __rest } from "tslib";
import * as React from 'react';
import { useMergedRefs } from '@fluentui/react-hooks';
import { classNamesFunction, useFocusRects } from '@fluentui/utilities';
var getClassNames = classNamesFunction();
/**
 * The useLink hook processes the Link component props and returns
 * state, slots and slotProps for consumption by the component.
 */
export var useLink = function (props, forwardedRef) {
    var as = props.as, className = props.className, disabled = props.disabled, href = props.href, onClick = props.onClick, styles = props.styles, theme = props.theme, underline = props.underline;
    var rootRef = React.useRef(null);
    var mergedRootRefs = useMergedRefs(rootRef, forwardedRef);
    useComponentRef(props, rootRef);
    useFocusRects(rootRef);
    var classNames = getClassNames(styles, {
        className: className,
        isButton: !href,
        isDisabled: disabled,
        isUnderlined: underline,
        theme: theme,
    });
    var _onClick = function (ev) {
        if (disabled) {
            ev.preventDefault();
        }
        else if (onClick) {
            onClick(ev);
        }
    };
    var rootType = as ? as : href ? 'a' : 'button';
    var state = {};
    var slots = { root: rootType };
    var slotProps = {
        root: __assign(__assign({}, adjustPropsForRootType(rootType, props)), { 'aria-disabled': disabled, className: classNames.root, onClick: _onClick, ref: mergedRootRefs }),
    };
    return { state: state, slots: slots, slotProps: slotProps };
};
var useComponentRef = function (props, link) {
    React.useImperativeHandle(props.componentRef, function () { return ({
        focus: function () {
            if (link.current) {
                link.current.focus();
            }
        },
    }); }, [link]);
};
var adjustPropsForRootType = function (RootType, props) {
    // Deconstruct the props so we remove props like `as`, `theme` and `styles`
    // as those will always be removed. We also take some props that are optional
    // based on the RootType.
    var as = props.as, disabled = props.disabled, target = props.target, href = props.href, theme = props.theme, getStyles = props.getStyles, styles = props.styles, componentRef = props.componentRef, underline = props.underline, restProps = __rest(props, ["as", "disabled", "target", "href", "theme", "getStyles", "styles", "componentRef", "underline"]);
    // RootType will be a string if we're dealing with an html component
    if (typeof RootType === 'string') {
        // Remove the disabled prop for anchor elements
        if (RootType === 'a') {
            return __assign({ target: target, href: disabled ? undefined : href }, restProps);
        }
        // Add the type='button' prop for button elements
        if (RootType === 'button') {
            return __assign({ type: 'button', disabled: disabled }, restProps);
        }
        // Remove the target and href props for all other non anchor elements
        return __assign(__assign({}, restProps), { disabled: disabled });
    }
    // Retain all props except 'as' for ReactComponents
    return __assign({ target: target, href: href, disabled: disabled }, restProps);
};
//# sourceMappingURL=useLink.js.map