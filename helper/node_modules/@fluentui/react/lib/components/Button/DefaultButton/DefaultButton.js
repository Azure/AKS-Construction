import { __assign, __decorate, __extends } from "tslib";
import * as React from 'react';
import { BaseButton } from '../BaseButton';
import { customizable, nullRender } from '../../../Utilities';
import { getStyles } from './DefaultButton.styles';
/**
 * {@docCategory Button}
 */
var DefaultButton = /** @class */ (function (_super) {
    __extends(DefaultButton, _super);
    function DefaultButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultButton.prototype.render = function () {
        var _a = this.props, _b = _a.primary, primary = _b === void 0 ? false : _b, styles = _a.styles, theme = _a.theme;
        return (React.createElement(BaseButton, __assign({}, this.props, { variantClassName: primary ? 'ms-Button--primary' : 'ms-Button--default', styles: getStyles(theme, styles, primary), onRenderDescription: nullRender })));
    };
    DefaultButton = __decorate([
        customizable('DefaultButton', ['theme', 'styles'], true)
    ], DefaultButton);
    return DefaultButton;
}(React.Component));
export { DefaultButton };
//# sourceMappingURL=DefaultButton.js.map