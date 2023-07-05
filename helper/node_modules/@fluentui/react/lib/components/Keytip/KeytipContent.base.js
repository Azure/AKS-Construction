import { __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction } from '../../Utilities';
/**
 * A component corresponding the content rendered inside the callout of the keytip component.
 * {@docCategory Keytips}
 */
var KeytipContentBase = /** @class */ (function (_super) {
    __extends(KeytipContentBase, _super);
    function KeytipContentBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeytipContentBase.prototype.render = function () {
        var _a = this.props, content = _a.content, styles = _a.styles, theme = _a.theme, disabled = _a.disabled, visible = _a.visible;
        var getClassNames = classNamesFunction();
        var classNames = getClassNames(styles, {
            theme: theme,
            disabled: disabled,
            visible: visible,
        });
        return (React.createElement("div", { className: classNames.container },
            React.createElement("span", { className: classNames.root }, content)));
    };
    return KeytipContentBase;
}(React.Component));
export { KeytipContentBase };
//# sourceMappingURL=KeytipContent.base.js.map