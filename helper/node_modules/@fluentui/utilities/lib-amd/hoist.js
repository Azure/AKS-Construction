define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unhoistMethods = exports.hoistMethods = void 0;
    var REACT_LIFECYCLE_EXCLUSIONS = [
        'setState',
        'render',
        'componentWillMount',
        'UNSAFE_componentWillMount',
        'componentDidMount',
        'componentWillReceiveProps',
        'UNSAFE_componentWillReceiveProps',
        'shouldComponentUpdate',
        'componentWillUpdate',
        'getSnapshotBeforeUpdate',
        'UNSAFE_componentWillUpdate',
        'componentDidUpdate',
        'componentWillUnmount',
    ];
    /**
     * Allows you to hoist methods, except those in an exclusion set from a source object into a destination object.
     *
     * @public
     * @param destination - The instance of the object to hoist the methods onto.
     * @param source - The instance of the object where the methods are hoisted from.
     * @param exclusions - (Optional) What methods to exclude from being hoisted.
     * @returns An array of names of methods that were hoisted.
     */
    function hoistMethods(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destination, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source, exclusions) {
        if (exclusions === void 0) { exclusions = REACT_LIFECYCLE_EXCLUSIONS; }
        var hoisted = [];
        var _loop_1 = function (methodName) {
            if (typeof source[methodName] === 'function' &&
                destination[methodName] === undefined &&
                (!exclusions || exclusions.indexOf(methodName) === -1)) {
                hoisted.push(methodName);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                destination[methodName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    source[methodName].apply(source, args);
                };
            }
        };
        for (var methodName in source) {
            _loop_1(methodName);
        }
        return hoisted;
    }
    exports.hoistMethods = hoistMethods;
    /**
     * Provides a method for convenience to unhoist hoisted methods.
     *
     * @public
     * @param source - The source object upon which methods were hoisted.
     * @param methodNames - An array of method names to unhoist.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function unhoistMethods(source, methodNames) {
        methodNames.forEach(function (methodName) { return delete source[methodName]; });
    }
    exports.unhoistMethods = unhoistMethods;
});
//# sourceMappingURL=hoist.js.map