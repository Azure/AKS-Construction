define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setPortalAttribute = exports.DATA_PORTAL_ATTRIBUTE = void 0;
    exports.DATA_PORTAL_ATTRIBUTE = 'data-portal-element';
    /**
     * Identify element as a portal by setting an attribute.
     * @param element - Element to mark as a portal.
     */
    function setPortalAttribute(element) {
        element.setAttribute(exports.DATA_PORTAL_ATTRIBUTE, 'true');
    }
    exports.setPortalAttribute = setPortalAttribute;
});
//# sourceMappingURL=setPortalAttribute.js.map