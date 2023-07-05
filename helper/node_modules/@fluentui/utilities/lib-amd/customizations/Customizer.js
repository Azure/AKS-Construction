define(["require", "exports", "tslib", "react", "./Customizations", "./CustomizerContext", "./mergeCustomizations"], function (require, exports, tslib_1, React, Customizations_1, CustomizerContext_1, mergeCustomizations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Customizer = void 0;
    /**
     * The Customizer component allows for default props to be mixed into components which
     * are decorated with the customizable() decorator, or use the styled HOC. This enables
     * injection scenarios like:
     *
     * 1. render svg icons instead of the icon font within all buttons
     * 2. inject a custom theme object into a component
     *
     * Props are provided via the settings prop which should be one of the following:
     * - A json map which contains 1 or more name/value pairs representing injectable props.
     * - A function that receives the current settings and returns the new ones that apply to the scope
     *
     * @public
     *
     * @deprecated This component is deprecated for purpose of applying theme to components
     * as of `@fluentui/react` version 8. Use `ThemeProvider` for applying theme instead.
     */
    var Customizer = /** @class */ (function (_super) {
        tslib_1.__extends(Customizer, _super);
        function Customizer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._onCustomizationChange = function () { return _this.forceUpdate(); };
            return _this;
        }
        Customizer.prototype.componentDidMount = function () {
            Customizations_1.Customizations.observe(this._onCustomizationChange);
        };
        Customizer.prototype.componentWillUnmount = function () {
            Customizations_1.Customizations.unobserve(this._onCustomizationChange);
        };
        Customizer.prototype.render = function () {
            var _this = this;
            var contextTransform = this.props.contextTransform;
            return (React.createElement(CustomizerContext_1.CustomizerContext.Consumer, null, function (parentContext) {
                var newContext = mergeCustomizations_1.mergeCustomizations(_this.props, parentContext);
                if (contextTransform) {
                    newContext = contextTransform(newContext);
                }
                return React.createElement(CustomizerContext_1.CustomizerContext.Provider, { value: newContext }, _this.props.children);
            }));
        };
        return Customizer;
    }(React.Component));
    exports.Customizer = Customizer;
});
//# sourceMappingURL=Customizer.js.map