import { __assign, __extends } from "tslib";
import * as React from 'react';
import { divProperties, getNativeProps } from '../../Utilities';
import { classNamesFunction } from '../../Utilities';
var getClassNames = classNamesFunction({
    // Label is used a lot by other components.
    // It's likely to see expected cases which pass different className to the Label.
    // Therefore setting a larger cache size.
    cacheSize: 100,
});
var LabelBase = /** @class */ (function (_super) {
    __extends(LabelBase, _super);
    function LabelBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelBase.prototype.render = function () {
        var _a = this.props, _b = _a.as, RootType = _b === void 0 ? 'label' : _b, children = _a.children, className = _a.className, disabled = _a.disabled, styles = _a.styles, required = _a.required, theme = _a.theme;
        var classNames = getClassNames(styles, {
            className: className,
            disabled: disabled,
            required: required,
            theme: theme,
        });
        return (React.createElement(RootType, __assign({}, getNativeProps(this.props, divProperties), { className: classNames.root }), children));
    };
    return LabelBase;
}(React.Component));
export { LabelBase };
//# sourceMappingURL=Label.base.js.map