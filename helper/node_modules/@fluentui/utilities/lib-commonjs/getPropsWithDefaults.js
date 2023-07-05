"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropsWithDefaults = void 0;
var tslib_1 = require("tslib");
/**
 * Function to apply default values to a component props object. This function is intended for function components,
 * to maintain parity with the `defaultProps` feature of class components. It accounts for properties that are
 * specified, but undefined.
 * @param defaultProps- An object with default values for various properties
 * @param propsWithoutDefaults- The props object passed into the component
 */
function getPropsWithDefaults(defaultProps, propsWithoutDefaults) {
    var props = tslib_1.__assign({}, propsWithoutDefaults);
    for (var _i = 0, _a = Object.keys(defaultProps); _i < _a.length; _i++) {
        var key = _a[_i];
        if (props[key] === undefined) {
            props[key] = defaultProps[key];
        }
    }
    return props;
}
exports.getPropsWithDefaults = getPropsWithDefaults;
//# sourceMappingURL=getPropsWithDefaults.js.map