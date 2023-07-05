import { __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction, initializeComponentRef } from '../../Utilities';
var getClassNames = classNamesFunction();
var DialogFooterBase = /** @class */ (function (_super) {
    __extends(DialogFooterBase, _super);
    function DialogFooterBase(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        return _this;
    }
    DialogFooterBase.prototype.render = function () {
        var _a = this.props, className = _a.className, styles = _a.styles, theme = _a.theme;
        this._classNames = getClassNames(styles, {
            theme: theme,
            className: className,
        });
        return (React.createElement("div", { className: this._classNames.actions },
            React.createElement("div", { className: this._classNames.actionsRight }, this._renderChildrenAsActions())));
    };
    DialogFooterBase.prototype._renderChildrenAsActions = function () {
        var _this = this;
        return React.Children.map(this.props.children, function (child) {
            return child ? React.createElement("span", { className: _this._classNames.action }, child) : null;
        });
    };
    return DialogFooterBase;
}(React.Component));
export { DialogFooterBase };
//# sourceMappingURL=DialogFooter.base.js.map