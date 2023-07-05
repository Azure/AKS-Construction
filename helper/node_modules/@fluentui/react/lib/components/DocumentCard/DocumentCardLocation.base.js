import { __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction, initializeComponentRef } from '../../Utilities';
var getClassNames = classNamesFunction();
/**
 * {@docCategory DocumentCard}
 */
var DocumentCardLocationBase = /** @class */ (function (_super) {
    __extends(DocumentCardLocationBase, _super);
    function DocumentCardLocationBase(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        return _this;
    }
    DocumentCardLocationBase.prototype.render = function () {
        var _a = this.props, location = _a.location, locationHref = _a.locationHref, ariaLabel = _a.ariaLabel, onClick = _a.onClick, styles = _a.styles, theme = _a.theme, className = _a.className;
        this._classNames = getClassNames(styles, {
            theme: theme,
            className: className,
        });
        return (React.createElement("a", { className: this._classNames.root, href: locationHref, onClick: onClick, "aria-label": ariaLabel }, location));
    };
    return DocumentCardLocationBase;
}(React.Component));
export { DocumentCardLocationBase };
//# sourceMappingURL=DocumentCardLocation.base.js.map