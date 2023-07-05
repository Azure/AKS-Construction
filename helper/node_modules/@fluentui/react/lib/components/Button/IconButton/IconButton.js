import { __assign, __decorate, __extends } from "tslib";
import * as React from 'react';
import { BaseButton } from '../BaseButton';
import { customizable, nullRender } from '../../../Utilities';
import { getStyles } from './IconButton.styles';
/**
 * {@docCategory Button}
 */
var IconButton = /** @class */ (function (_super) {
    __extends(IconButton, _super);
    function IconButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IconButton.prototype.render = function () {
        var _a = this.props, styles = _a.styles, theme = _a.theme;
        return (React.createElement(BaseButton, __assign({}, this.props, { variantClassName: "ms-Button--icon", styles: getStyles(theme, styles), onRenderText: nullRender, onRenderDescription: nullRender })));
    };
    IconButton = __decorate([
        customizable('IconButton', ['theme', 'styles'], true)
    ], IconButton);
    return IconButton;
}(React.Component));
export { IconButton };
//# sourceMappingURL=IconButton.js.map