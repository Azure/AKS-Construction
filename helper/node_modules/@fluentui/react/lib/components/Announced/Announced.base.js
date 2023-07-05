import { __assign, __extends } from "tslib";
import * as React from 'react';
import { DelayedRender, classNamesFunction, getNativeProps, divProperties } from '../../Utilities';
var getClassNames = classNamesFunction();
/**
 * {@docCategory Announced}
 */
var AnnouncedBase = /** @class */ (function (_super) {
    __extends(AnnouncedBase, _super);
    function AnnouncedBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnnouncedBase.prototype.render = function () {
        var _a = this.props, message = _a.message, styles = _a.styles, _b = _a.as, Root = _b === void 0 ? 'div' : _b, className = _a.className;
        var classNames = getClassNames(styles, { className: className });
        return (React.createElement(Root, __assign({ role: "status", className: classNames.root }, getNativeProps(this.props, divProperties, ['className'])),
            React.createElement(DelayedRender, null,
                React.createElement("div", { className: classNames.screenReaderText }, message))));
    };
    AnnouncedBase.defaultProps = {
        'aria-live': 'polite',
    };
    return AnnouncedBase;
}(React.Component));
export { AnnouncedBase };
//# sourceMappingURL=Announced.base.js.map