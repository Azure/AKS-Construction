import { __assign, __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction, getNativeProps, divProperties, enableBodyScroll, disableBodyScroll, initializeComponentRef, } from '../../Utilities';
var getClassNames = classNamesFunction();
var OverlayBase = /** @class */ (function (_super) {
    __extends(OverlayBase, _super);
    function OverlayBase(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        var _a = _this.props.allowTouchBodyScroll, allowTouchBodyScroll = _a === void 0 ? false : _a;
        _this._allowTouchBodyScroll = allowTouchBodyScroll;
        return _this;
    }
    OverlayBase.prototype.componentDidMount = function () {
        !this._allowTouchBodyScroll && disableBodyScroll();
    };
    OverlayBase.prototype.componentWillUnmount = function () {
        !this._allowTouchBodyScroll && enableBodyScroll();
    };
    OverlayBase.prototype.render = function () {
        var _a = this.props, isDark = _a.isDarkThemed, className = _a.className, theme = _a.theme, styles = _a.styles;
        var divProps = getNativeProps(this.props, divProperties);
        var classNames = getClassNames(styles, {
            theme: theme,
            className: className,
            isDark: isDark,
        });
        return React.createElement("div", __assign({}, divProps, { className: classNames.root }));
    };
    return OverlayBase;
}(React.Component));
export { OverlayBase };
//# sourceMappingURL=Overlay.base.js.map