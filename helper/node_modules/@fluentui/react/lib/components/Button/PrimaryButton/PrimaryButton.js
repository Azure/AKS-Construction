import { __assign, __decorate, __extends } from "tslib";
import * as React from 'react';
import { customizable, nullRender } from '../../../Utilities';
import { DefaultButton } from '../DefaultButton/DefaultButton';
/**
 * {@docCategory Button}
 */
var PrimaryButton = /** @class */ (function (_super) {
    __extends(PrimaryButton, _super);
    function PrimaryButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrimaryButton.prototype.render = function () {
        return React.createElement(DefaultButton, __assign({}, this.props, { primary: true, onRenderDescription: nullRender }));
    };
    PrimaryButton = __decorate([
        customizable('PrimaryButton', ['theme', 'styles'], true)
    ], PrimaryButton);
    return PrimaryButton;
}(React.Component));
export { PrimaryButton };
//# sourceMappingURL=PrimaryButton.js.map