import { __assign, __extends } from "tslib";
import * as React from 'react';
import { BaseDecorator } from './BaseDecorator';
import { Async } from '../../Utilities';
export function withContainsFocus(ComposedComponent) {
    return /** @class */ (function (_super) {
        __extends(WithContainsFocusComponent, _super);
        function WithContainsFocusComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                containsFocus: false,
            };
            _this._async = new Async(_this);
            _this._delayedSetContainsFocus = _this._async.debounce(_this._setContainsFocus, 20);
            _this._updateComposedComponentRef = _this._updateComposedComponentRef.bind(_this);
            _this._handleFocus = _this._handleFocus.bind(_this);
            _this._handleBlur = _this._handleBlur.bind(_this);
            return _this;
        }
        WithContainsFocusComponent.prototype.componentWillUnmount = function () {
            this._async.dispose();
        };
        WithContainsFocusComponent.prototype.render = function () {
            var containsFocus = this.state.containsFocus;
            return (React.createElement("div", { onFocus: this._handleFocus, onBlur: this._handleBlur },
                React.createElement(ComposedComponent, __assign({ ref: this._updateComposedComponentRef, containsFocus: containsFocus }, this.props))));
        };
        WithContainsFocusComponent.prototype.forceUpdate = function () {
            this._composedComponentInstance.forceUpdate();
        };
        WithContainsFocusComponent.prototype._handleFocus = function (ev) {
            this._newContainsFocus = true;
            this._delayedSetContainsFocus();
        };
        WithContainsFocusComponent.prototype._handleBlur = function (ev) {
            this._newContainsFocus = false;
            this._delayedSetContainsFocus();
        };
        WithContainsFocusComponent.prototype._setContainsFocus = function () {
            if (this.state.containsFocus !== this._newContainsFocus) {
                this.setState({ containsFocus: this._newContainsFocus });
            }
        };
        return WithContainsFocusComponent;
    }(BaseDecorator));
}
//# sourceMappingURL=withContainsFocus.js.map