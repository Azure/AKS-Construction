import { __assign, __decorate, __extends } from "tslib";
import * as React from 'react';
import { BaseButton } from '../BaseButton';
import { customizable, nullRender } from '../../../Utilities';
import { getStyles } from './CommandBarButton.styles';
/**
 * {@docCategory Button}
 */
var CommandBarButton = /** @class */ (function (_super) {
    __extends(CommandBarButton, _super);
    function CommandBarButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommandBarButton.prototype.render = function () {
        var _a = this.props, styles = _a.styles, theme = _a.theme;
        return (React.createElement(BaseButton, __assign({}, this.props, { variantClassName: "ms-Button--commandBar", styles: getStyles(theme, styles), onRenderDescription: nullRender })));
    };
    CommandBarButton = __decorate([
        customizable('CommandBarButton', ['theme', 'styles'], true)
    ], CommandBarButton);
    return CommandBarButton;
}(React.Component));
export { CommandBarButton };
//# sourceMappingURL=CommandBarButton.js.map