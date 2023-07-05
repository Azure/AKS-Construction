import { __assign, __extends } from "tslib";
import * as React from 'react';
import { Customizations } from './Customizations';
import { hoistStatics } from '../hoistStatics';
import { CustomizerContext } from './CustomizerContext';
import { concatStyleSets } from '@fluentui/merge-styles';
export function customizable(scope, fields, concatStyles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function customizableFactory(ComposedComponent) {
        var _a;
        var resultClass = (_a = /** @class */ (function (_super) {
                __extends(ComponentWithInjectedProps, _super);
                function ComponentWithInjectedProps(props) {
                    var _this = _super.call(this, props) || this;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _this._styleCache = {};
                    _this._onSettingChanged = _this._onSettingChanged.bind(_this);
                    return _this;
                }
                ComponentWithInjectedProps.prototype.componentDidMount = function () {
                    Customizations.observe(this._onSettingChanged);
                };
                ComponentWithInjectedProps.prototype.componentWillUnmount = function () {
                    Customizations.unobserve(this._onSettingChanged);
                };
                ComponentWithInjectedProps.prototype.render = function () {
                    var _this = this;
                    return (React.createElement(CustomizerContext.Consumer, null, function (context) {
                        var defaultProps = Customizations.getSettings(fields, scope, context.customizations);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        var componentProps = _this.props;
                        // If defaultProps.styles is a function, evaluate it before calling concatStyleSets
                        if (defaultProps.styles && typeof defaultProps.styles === 'function') {
                            defaultProps.styles = defaultProps.styles(__assign(__assign({}, defaultProps), componentProps));
                        }
                        // If concatStyles is true and custom styles have been defined compute those styles
                        if (concatStyles && defaultProps.styles) {
                            if (_this._styleCache.default !== defaultProps.styles ||
                                _this._styleCache.component !== componentProps.styles) {
                                var mergedStyles = concatStyleSets(defaultProps.styles, componentProps.styles);
                                _this._styleCache.default = defaultProps.styles;
                                _this._styleCache.component = componentProps.styles;
                                _this._styleCache.merged = mergedStyles;
                            }
                            return React.createElement(ComposedComponent, __assign({}, defaultProps, componentProps, { styles: _this._styleCache.merged }));
                        }
                        return React.createElement(ComposedComponent, __assign({}, defaultProps, componentProps));
                    }));
                };
                ComponentWithInjectedProps.prototype._onSettingChanged = function () {
                    this.forceUpdate();
                };
                return ComponentWithInjectedProps;
            }(React.Component)),
            _a.displayName = 'Customized' + scope,
            _a);
        return hoistStatics(ComposedComponent, resultClass);
    };
}
//# sourceMappingURL=customizable.js.map