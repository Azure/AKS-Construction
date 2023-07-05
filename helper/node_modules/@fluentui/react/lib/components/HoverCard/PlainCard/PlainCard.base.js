import { __assign, __extends } from "tslib";
import * as React from 'react';
import { classNamesFunction, initializeComponentRef, KeyCodes } from '../../../Utilities';
import { CardCallout } from '../CardCallout/CardCallout';
var getClassNames = classNamesFunction();
var PlainCardBase = /** @class */ (function (_super) {
    __extends(PlainCardBase, _super);
    function PlainCardBase(props) {
        var _this = _super.call(this, props) || this;
        _this._onKeyDown = function (ev) {
            // eslint-disable-next-line deprecation/deprecation
            if (ev.which === KeyCodes.escape) {
                _this.props.onLeave && _this.props.onLeave(ev);
            }
        };
        initializeComponentRef(_this);
        return _this;
    }
    PlainCardBase.prototype.render = function () {
        var _a = this.props, styles = _a.styles, theme = _a.theme, className = _a.className;
        this._classNames = getClassNames(styles, {
            theme: theme,
            className: className,
        });
        var content = (React.createElement("div", { onMouseEnter: this.props.onEnter, onMouseLeave: this.props.onLeave, onKeyDown: this._onKeyDown }, this.props.onRenderPlainCard(this.props.renderData)));
        return React.createElement(CardCallout, __assign({}, this.props, { content: content, className: this._classNames.root }));
    };
    return PlainCardBase;
}(React.Component));
export { PlainCardBase };
//# sourceMappingURL=PlainCard.base.js.map