define(["require", "exports", "./isVirtualElement"], function (require, exports, isVirtualElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getVirtualParent = void 0;
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
});
//# sourceMappingURL=getVirtualParent.js.map