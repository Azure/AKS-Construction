import { __assign, __decorate, __extends } from "tslib";
import * as React from 'react';
import { DefaultButton } from '../DefaultButton/DefaultButton';
import { customizable, nullRender } from '../../../Utilities';
import { getStyles } from './MessageBarButton.styles';
/**
 * {@docCategory MessageBar}
 */
var MessageBarButton = /** @class */ (function (_super) {
    __extends(MessageBarButton, _super);
    function MessageBarButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MessageBarButton.prototype.render = function () {
        var _a = this.props, styles = _a.styles, theme = _a.theme;
        return React.createElement(DefaultButton, __assign({}, this.props, { styles: getStyles(theme, styles), onRenderDescription: nullRender }));
    };
    MessageBarButton = __decorate([
        customizable('MessageBarButton', ['theme', 'styles'], true)
    ], MessageBarButton);
    return MessageBarButton;
}(React.Component));
export { MessageBarButton };
//# sourceMappingURL=MessageBarButton.js.map