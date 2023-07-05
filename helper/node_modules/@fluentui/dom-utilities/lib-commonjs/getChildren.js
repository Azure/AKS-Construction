"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildren = void 0;
var isVirtualElement_1 = require("./isVirtualElement");
/**
 * Gets the elements which are child elements of the given element.
 * If `allowVirtualChildren` is `true`, this method enumerates virtual child elements
 * after the original children.
 * @param parent - The element to get the children of.
 * @param allowVirtualChildren - true if the method should enumerate virtual child elements.
 */
function getChildren(parent, allowVirtualChildren) {
    if (allowVirtualChildren === void 0) { allowVirtualChildren = true; }
    var children = [];
    if (parent) {
        for (var i = 0; i < parent.children.length; i++) {
            children.push(parent.children.item(i));
        }
        if (allowVirtualChildren && isVirtualElement_1.isVirtualElement(parent)) {
            children.push.apply(children, parent._virtual.children);
        }
    }
    return children;
}
exports.getChildren = getChildren;
//# sourceMappingURL=getChildren.js.map