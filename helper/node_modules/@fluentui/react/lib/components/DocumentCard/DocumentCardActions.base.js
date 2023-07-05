import { __assign, __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction, initializeComponentRef } from '../../Utilities';
import { Icon } from '../../Icon';
import { IconButton } from '../../Button';
var getClassNames = classNamesFunction();
/**
 * {@docCategory DocumentCard}
 */
var DocumentCardActionsBase = /** @class */ (function (_super) {
    __extends(DocumentCardActionsBase, _super);
    function DocumentCardActionsBase(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        return _this;
    }
    DocumentCardActionsBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, views = _a.views, styles = _a.styles, theme = _a.theme, className = _a.className;
        this._classNames = getClassNames(styles, {
            theme: theme,
            className: className,
        });
        return (React.createElement("div", { className: this._classNames.root },
            actions &&
                actions.map(function (action, index) {
                    return (React.createElement("div", { className: _this._classNames.action, key: index },
                        React.createElement(IconButton, __assign({}, action))));
                }),
            views > 0 && (React.createElement("div", { className: this._classNames.views },
                React.createElement(Icon, { iconName: "View", className: this._classNames.viewsIcon }),
                views))));
    };
    return DocumentCardActionsBase;
}(React.Component));
export { DocumentCardActionsBase };
//# sourceMappingURL=DocumentCardActions.base.js.map