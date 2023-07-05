"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVirtualElement = void 0;
/**
 * Determines whether or not an element has the virtual hierarchy extension.
 *
 * @public
 */
function isVirtualElement(element) {
    return element && !!element._virtual;
}
exports.isVirtualElement = isVirtualElement;
//# sourceMappingURL=isVirtualElement.js.map