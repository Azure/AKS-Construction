"use strict";
/**
 * asAsync - a HOC for async loading components.
 *
 * Usage:
 *
 * const AsyncDialog = asAsync({
 *   load: () => import('Dialog').then(result => result.default),
 * });
 *
 * React.render(domElement, <AsyncDialog asyncPlaceholder={ () => <Spinner/> } { ...dialogProps } />);
 *
 * Note the `asyncPlaceholder` prop will be respected when rendering the async component and it hasn't
 * been loaded yet.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asAsync = void 0;
var tslib_1 = require("tslib");
var React = require("react");
/**
 * If possible, use a WeakMap to maintain a cache of loaded components.
 * This can be used to synchronously render components that have already been loaded,
 * rather than having to wait for at least one async tick.
 */
var _syncModuleCache = typeof WeakMap !== 'undefined'
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new WeakMap()
    : undefined;
/**
 * Produces a component which internally loads the target component before first mount.
 * The component passes all props through to the loaded component.
 *
 * This overload accepts a module with a default export for the component.
 */
function asAsync(options) {
    var Async = /** @class */ (function (_super) {
        tslib_1.__extends(Async, _super);
        function Async() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.state = {
                Component: _syncModuleCache ? _syncModuleCache.get(options.load) : undefined,
            };
            return _this;
        }
        Async.prototype.render = function () {
            // Typescript issue: the rest can't be pulled without the any cast, as TypeScript fails with rest on generics.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var _a = this.props, forwardedRef = _a.forwardedRef, Placeholder = _a.asyncPlaceholder, rest = tslib_1.__rest(_a, ["forwardedRef", "asyncPlaceholder"]);
            var Component = this.state.Component;
            return Component ? (React.createElement(Component, tslib_1.__assign(tslib_1.__assign({}, rest), { ref: forwardedRef }))) : Placeholder ? (React.createElement(Placeholder, null)) : null;
        };
        Async.prototype.componentDidMount = function () {
            var _this = this;
            var Component = this.state.Component;
            if (!Component) {
                options
                    .load()
                    .then(function (LoadedComponent) {
                    if (LoadedComponent) {
                        // Cache component for future reference.
                        _syncModuleCache && _syncModuleCache.set(options.load, LoadedComponent);
                        // Set state.
                        _this.setState({
                            Component: LoadedComponent,
                        }, options.onLoad);
                    }
                })
                    .catch(options.onError);
            }
        };
        return Async;
    }(React.Component));
    return React.forwardRef(function (props, ref) { return React.createElement(Async, tslib_1.__assign({}, props, { forwardedRef: ref })); });
}
exports.asAsync = asAsync;
//# sourceMappingURL=asAsync.js.map