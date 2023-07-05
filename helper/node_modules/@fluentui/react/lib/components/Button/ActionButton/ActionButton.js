import { __assign, __decorate, __extends } from "tslib";
import * as React from 'react';
import { BaseButton } from '../BaseButton';
import { customizable, nullRender } from '../../../Utilities';
import { getStyles } from './ActionButton.styles';
/**
 * {@docCategory Button}
 */
var ActionButton = /** @class */ (function (_super) {
    __extends(ActionButton, _super);
    function ActionButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionButton.prototype.render = function () {
        var _a = this.props, styles = _a.styles, theme = _a.theme;
        return (React.createElement(BaseButton, __assign({}, this.props, { variantClassName: "ms-Button--action ms-Button--command", styles: getStyles(theme, styles), onRenderDescription: nullRender })));
    };
    ActionButton = __decorate([
        customizable('ActionButton', ['theme', 'styles'], true)
    ], ActionButton);
    return ActionButton;
}(React.Component));
export { ActionButton };
//# sourceMappingURL=ActionButton.js.map