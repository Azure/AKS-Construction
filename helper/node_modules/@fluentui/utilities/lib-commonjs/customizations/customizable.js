"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customizable = void 0;
var tslib_1 = require("tslib");
var React = require("react");
var Customizations_1 = require("./Customizations");
var hoistStatics_1 = require("../hoistStatics");
var CustomizerContext_1 = require("./CustomizerContext");
var merge_styles_1 = require("@fluentui/merge-styles");
function customizable(scope, fields, concatStyles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function customizableFactory(ComposedComponent) {
        var _a;
        var resultClass = (_a = /** @class */ (function (_super) {
                tslib_1.__extends(ComponentWithInjectedProps, _super);
                function ComponentWithInjectedProps(props) {
                    var _this = _super.call(this, props) || this;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _this._styleCache = {};
                    _this._onSettingChanged = _this._onSettingChanged.bind(_this);
                    return _this;
                }
                ComponentWithInjectedProps.prototype.componentDidMount = function () {
                    Customizations_1.Customizations.observe(this._onSettingChanged);
                };
                ComponentWithInjectedProps.prototype.componentWillUnmount = function () {
                    Customizations_1.Customizations.unobserve(this._onSettingChanged);
                };
                ComponentWithInjectedProps.prototype.render = function () {
                    var _this = this;
                    return (React.createElement(CustomizerContext_1.CustomizerContext.Consumer, null, function (context) {
                        var defaultProps = Customizations_1.Customizations.getSettings(fields, scope, context.customizations);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        var componentProps = _this.props;
                        // If defaultProps.styles is a function, evaluate it before calling concatStyleSets
                        if (defaultProps.styles && typeof defaultProps.styles === 'function') {
                            defaultProps.styles = defaultProps.styles(tslib_1.__assign(tslib_1.__assign({}, defaultProps), componentProps));
                        }
                        // If concatStyles is true and custom styles have been defined compute those styles
                        if (concatStyles && defaultProps.styles) {
                            if (_this._styleCache.default !== defaultProps.styles ||
                                _this._styleCache.component !== componentProps.styles) {
                                var mergedStyles = merge_styles_1.concatStyleSets(defaultProps.styles, componentProps.styles);
                                _this._styleCache.default = defaultProps.styles;
                                _this._styleCache.component = componentProps.styles;
                                _this._styleCache.merged = mergedStyles;
                            }
                            return React.createElement(ComposedComponent, tslib_1.__assign({}, defaultProps, componentProps, { styles: _this._styleCache.merged }));
                        }
                        return React.createElement(ComposedComponent, tslib_1.__assign({}, defaultProps, componentProps));
                    }));
                };
                ComponentWithInjectedProps.prototype._onSettingChanged = function () {
                    this.forceUpdate();
                };
                return ComponentWithInjectedProps;
            }(React.Component)),
            _a.displayName = 'Customized' + scope,
            _a);
        return hoistStatics_1.hoistStatics(ComposedComponent, resultClass);
    };
}
exports.customizable = customizable;
//# sourceMappingURL=customizable.js.map