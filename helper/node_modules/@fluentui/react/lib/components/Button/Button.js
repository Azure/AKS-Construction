import { __assign, __extends } from "tslib";
import * as React from 'react';
import { warn } from '../../Utilities';
import { ButtonType } from './Button.types';
import { DefaultButton } from './DefaultButton/DefaultButton';
import { ActionButton } from './ActionButton/ActionButton';
import { CompoundButton } from './CompoundButton/CompoundButton';
import { IconButton } from './IconButton/IconButton';
import { PrimaryButton } from './PrimaryButton/PrimaryButton';
/**
 * This class is deprecated. Use the individual *Button components instead.
 * @deprecated Use the individual *Button components instead.
 * {@docCategory Button}
 */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(props) {
        var _this = _super.call(this, props) || this;
        warn("The Button component has been deprecated. Use specific variants instead. " +
            "(PrimaryButton, DefaultButton, IconButton, ActionButton, etc.)");
        return _this;
    }
    Button.prototype.render = function () {
        var props = this.props;
        // eslint-disable-next-line deprecation/deprecation
        switch (props.buttonType) {
            case ButtonType.command:
                return React.createElement(ActionButton, __assign({}, props));
            case ButtonType.compound:
                return React.createElement(CompoundButton, __assign({}, props));
            case ButtonType.icon:
                return React.createElement(IconButton, __assign({}, props));
            case ButtonType.primary:
                return React.createElement(PrimaryButton, __assign({}, props));
            default:
                return React.createElement(DefaultButton, __assign({}, props));
        }
    };
    return Button;
}(React.Component));
export { Button };
//# sourceMappingURL=Button.js.map