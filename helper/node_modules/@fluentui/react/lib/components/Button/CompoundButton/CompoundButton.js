import { __assign, __decorate, __extends } from "tslib";
import * as React from 'react';
import { BaseButton } from '../BaseButton';
import { customizable } from '../../../Utilities';
import { getStyles } from './CompoundButton.styles';
/**
 * {@docCategory Button}
 */
var CompoundButton = /** @class */ (function (_super) {
    __extends(CompoundButton, _super);
    function CompoundButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CompoundButton.prototype.render = function () {
        var _a = this.props, _b = _a.primary, primary = _b === void 0 ? false : _b, styles = _a.styles, theme = _a.theme;
        return (React.createElement(BaseButton, __assign({}, this.props, { variantClassName: primary ? 'ms-Button--compoundPrimary' : 'ms-Button--compound', styles: getStyles(theme, styles, primary) })));
    };
    CompoundButton = __decorate([
        customizable('CompoundButton', ['theme', 'styles'], true)
    ], CompoundButton);
    return CompoundButton;
}(React.Component));
export { CompoundButton };
//# sourceMappingURL=CompoundButton.js.map