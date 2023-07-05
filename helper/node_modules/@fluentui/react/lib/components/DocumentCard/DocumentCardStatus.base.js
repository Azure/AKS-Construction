import { __assign, __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction, initializeComponentRef } from '../../Utilities';
import { Icon } from '../../Icon';
var getClassNames = classNamesFunction();
/**
 * {@docCategory DocumentCard}
 */
var DocumentCardStatusBase = /** @class */ (function (_super) {
    __extends(DocumentCardStatusBase, _super);
    function DocumentCardStatusBase(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        return _this;
    }
    DocumentCardStatusBase.prototype.render = function () {
        var _a = this.props, statusIcon = _a.statusIcon, status = _a.status, styles = _a.styles, theme = _a.theme, className = _a.className;
        var iconProps = {
            iconName: statusIcon,
            styles: {
                root: { padding: '8px' },
            },
        };
        this._classNames = getClassNames(styles, {
            theme: theme,
            className: className,
        });
        return (React.createElement("div", { className: this._classNames.root },
            statusIcon && React.createElement(Icon, __assign({}, iconProps)),
            status));
    };
    return DocumentCardStatusBase;
}(React.Component));
export { DocumentCardStatusBase };
//# sourceMappingURL=DocumentCardStatus.base.js.map