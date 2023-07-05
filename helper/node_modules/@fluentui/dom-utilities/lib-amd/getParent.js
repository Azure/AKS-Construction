define(["require", "exports", "./getVirtualParent"], function (require, exports, getVirtualParent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getParent = void 0;
    /**
     * Gets the element which is the parent of a given element.
     * If `allowVirtuaParents` is `true`, this method prefers the virtual parent over
     * real DOM parent when present.
     *
     * @public
     */
    function getParent(child, allowVirtualParents) {
        if (allowVirtualParents === void 0) { allowVirtualParents = true; }
        return (child &&
            ((allowVirtualParents && getVirtualParent_1.getVirtualParent(child)) || (child.parentNode && child.parentNode)));
    }
    exports.getParent = getParent;
});
//# sourceMappingURL=getParent.js.map