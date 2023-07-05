"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVirtualParent = void 0;
var isVirtualElement_1 = require("./isVirtualElement");
/**
 * Gets the virtual parent given the child element, if it exists.
 *
 * @public
 */
function getVirtualParent(child) {
    var parent;
    if (child && isVirtualElement_1.isVirtualElement(child)) {
        parent = child._virtual.parent;
    }
    return parent;
}
exports.getVirtualParent = getVirtualParent;
//# sourceMappingURL=getVirtualParent.js.map