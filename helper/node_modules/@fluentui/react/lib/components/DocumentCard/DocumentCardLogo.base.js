import { __extends } from "tslib";
import * as React from 'react';
import { Icon } from '../../Icon';
import { classNamesFunction, initializeComponentRef } from '../../Utilities';
var getClassNames = classNamesFunction();
/**
 * {@docCategory DocumentCard}
 */
var DocumentCardLogoBase = /** @class */ (function (_super) {
    __extends(DocumentCardLogoBase, _super);
    function DocumentCardLogoBase(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        return _this;
    }
    DocumentCardLogoBase.prototype.render = function () {
        var _a = this.props, logoIcon = _a.logoIcon, styles = _a.styles, theme = _a.theme, className = _a.className;
        this._classNames = getClassNames(styles, {
            theme: theme,
            className: className,
        });
        return (React.createElement("div", { className: this._classNames.root },
            React.createElement(Icon, { iconName: logoIcon })));
    };
    return DocumentCardLogoBase;
}(React.Component));
export { DocumentCardLogoBase };
//# sourceMappingURL=DocumentCardLogo.base.js.map