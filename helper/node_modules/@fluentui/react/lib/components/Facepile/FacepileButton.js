import { __assign, __decorate, __extends, __rest } from "tslib";
import * as React from 'react';
import { BaseButton } from '../../Button';
import { customizable, nullRender } from '../../Utilities';
import { getStyles } from './FacepileButton.styles';
var FacepileButton = /** @class */ (function (_super) {
    __extends(FacepileButton, _super);
    function FacepileButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FacepileButton.prototype.render = function () {
        var _a = this.props, className = _a.className, styles = _a.styles, rest = __rest(_a, ["className", "styles"]);
        var customStyles = getStyles(this.props.theme, className, styles);
        return (React.createElement(BaseButton, __assign({}, rest, { variantClassName: "ms-Button--facepile", styles: customStyles, onRenderDescription: nullRender })));
    };
    FacepileButton = __decorate([
        customizable('FacepileButton', ['theme', 'styles'], true)
    ], FacepileButton);
    return FacepileButton;
}(React.Component));
export { FacepileButton };
//# sourceMappingURL=FacepileButton.js.map