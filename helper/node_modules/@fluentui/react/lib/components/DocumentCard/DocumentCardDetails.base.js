import { __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction, initializeComponentRef } from '../../Utilities';
var getClassNames = classNamesFunction();
/**
 * {@docCategory DocumentCard}
 */
var DocumentCardDetailsBase = /** @class */ (function (_super) {
    __extends(DocumentCardDetailsBase, _super);
    function DocumentCardDetailsBase(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        return _this;
    }
    DocumentCardDetailsBase.prototype.render = function () {
        var _a = this.props, children = _a.children, styles = _a.styles, theme = _a.theme, className = _a.className;
        this._classNames = getClassNames(styles, {
            theme: theme,
            className: className,
        });
        return React.createElement("div", { className: this._classNames.root }, children);
    };
    return DocumentCardDetailsBase;
}(React.Component));
export { DocumentCardDetailsBase };
//# sourceMappingURL=DocumentCardDetails.base.js.map