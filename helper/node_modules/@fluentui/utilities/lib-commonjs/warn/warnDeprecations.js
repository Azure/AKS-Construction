"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnDeprecations = void 0;
var warn_1 = require("./warn");
/**
 * Warns when a deprecated props are being used.
 *
 * @public
 * @param componentName - The name of the component being used.
 * @param props - The props passed into the component.
 * @param deprecationMap - The map of deprecations, where key is the prop name and the value is
 * either null or a replacement prop name.
 */
function warnDeprecations(componentName, props, deprecationMap) {
    if (process.env.NODE_ENV !== 'production') {
        for (var propName in deprecationMap) {
            if (props && propName in props) {
                var deprecationMessage = componentName + " property '" + propName + "' was used but has been deprecated.";
                var replacementPropName = deprecationMap[propName];
                if (replacementPropName) {
                    deprecationMessage += " Use '" + replacementPropName + "' instead.";
                }
                warn_1.warn(deprecationMessage);
            }
        }
    }
}
exports.warnDeprecations = warnDeprecations;
//# sourceMappingURL=warnDeprecations.js.map