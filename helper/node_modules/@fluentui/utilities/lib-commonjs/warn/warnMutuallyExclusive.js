"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnMutuallyExclusive = void 0;
var warn_1 = require("./warn");
/**
 * Warns when two props which are mutually exclusive are both being used.
 *
 * @public
 * @param componentName - The name of the component being used.
 * @param props - The props passed into the component.
 * @param exclusiveMap - A map where the key is a parameter, and the value is the other parameter.
 */
function warnMutuallyExclusive(componentName, props, exclusiveMap) {
    if (process.env.NODE_ENV !== 'production') {
        for (var propName in exclusiveMap) {
            if (props && props[propName] !== undefined) {
                var propInExclusiveMapValue = exclusiveMap[propName];
                if (propInExclusiveMapValue && props[propInExclusiveMapValue] !== undefined) {
                    warn_1.warn(componentName + " property '" + propName + "' is mutually exclusive with '" + exclusiveMap[propName] + "'. " +
                        "Use one or the other.");
                }
            }
        }
    }
}
exports.warnMutuallyExclusive = warnMutuallyExclusive;
//# sourceMappingURL=warnMutuallyExclusive.js.map