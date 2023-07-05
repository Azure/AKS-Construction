import { __extends } from "tslib";
import * as React from 'react';
import { hoistMethods, unhoistMethods } from '../../Utilities';
var BaseDecorator = /** @class */ (function (_super) {
    __extends(BaseDecorator, _super);
    function BaseDecorator(props) {
        var _this = _super.call(this, props) || this;
        _this._updateComposedComponentRef = _this._updateComposedComponentRef.bind(_this);
        return _this;
    }
    /**
     * Updates the ref to the component composed by the decorator, which will also take care of hoisting
     * (and unhoisting as appropriate) methods from said component.
     *
     * Pass this method as the argument to the 'ref' property of the composed component.
     */
    BaseDecorator.prototype._updateComposedComponentRef = function (composedComponentInstance) {
        this._composedComponentInstance = composedComponentInstance;
        if (composedComponentInstance) {
            this._hoisted = hoistMethods(this, composedComponentInstance);
        }
        else if (this._hoisted) {
            unhoistMethods(this, this._hoisted);
        }
    };
    return BaseDecorator;
}(React.Component));
export { BaseDecorator };
//# sourceMappingURL=BaseDecorator.js.map