import { __assign, __extends } from "tslib";
import * as React from 'react';
import { SpinnerType, SpinnerSize } from './Spinner.types';
import { classNamesFunction, DelayedRender, getNativeProps, divProperties } from '../../Utilities';
var getClassNames = classNamesFunction();
var SpinnerBase = /** @class */ (function (_super) {
    __extends(SpinnerBase, _super);
    function SpinnerBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpinnerBase.prototype.render = function () {
        // eslint-disable-next-line deprecation/deprecation
        var _a = this.props, type = _a.type, size = _a.size, ariaLabel = _a.ariaLabel, ariaLive = _a.ariaLive, styles = _a.styles, label = _a.label, theme = _a.theme, className = _a.className, labelPosition = _a.labelPosition;
        var statusMessage = ariaLabel;
        var nativeProps = getNativeProps(this.props, divProperties, ['size']);
        // SpinnerType is deprecated. If someone is still using this property, rather than putting the SpinnerType into the
        // ISpinnerStyleProps, we'll map SpinnerType to its equivalent SpinnerSize and pass that in. Once SpinnerType
        // finally goes away we should delete this.
        var styleSize = size;
        if (styleSize === undefined && type !== undefined) {
            // eslint-disable-next-line deprecation/deprecation
            styleSize = type === SpinnerType.large ? SpinnerSize.large : SpinnerSize.medium;
        }
        var classNames = getClassNames(styles, {
            theme: theme,
            size: styleSize,
            className: className,
            labelPosition: labelPosition,
        });
        return (React.createElement("div", __assign({}, nativeProps, { className: classNames.root }),
            React.createElement("div", { className: classNames.circle }),
            label && React.createElement("div", { className: classNames.label }, label),
            statusMessage && (React.createElement("div", { role: "status", "aria-live": ariaLive },
                React.createElement(DelayedRender, null,
                    React.createElement("div", { className: classNames.screenReaderText }, statusMessage))))));
    };
    SpinnerBase.defaultProps = {
        size: SpinnerSize.medium,
        ariaLive: 'polite',
        labelPosition: 'bottom',
    };
    return SpinnerBase;
}(React.Component));
export { SpinnerBase };
//# sourceMappingURL=Spinner.base.js.map