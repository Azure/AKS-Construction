"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portalContainsElement = void 0;
var findElementRecursive_1 = require("./findElementRecursive");
var setPortalAttribute_1 = require("./setPortalAttribute");
/**
 * Determine whether a target is within a portal from perspective of root or optional parent.
 * This function only works against portal components that use the setPortalAttribute function.
 * If both parent and child are within the same portal this function will return false.
 * @param target - Element to query portal containment status of.
 * @param parent - Optional parent perspective. Search for containing portal stops at parent
 * (or root if parent is undefined or invalid.)
 */
function portalContainsElement(target, parent) {
    var elementMatch = findElementRecursive_1.findElementRecursive(target, function (testElement) { return parent === testElement || testElement.hasAttribute(setPortalAttribute_1.DATA_PORTAL_ATTRIBUTE); });
    return elementMatch !== null && elementMatch.hasAttribute(setPortalAttribute_1.DATA_PORTAL_ATTRIBUTE);
}
exports.portalContainsElement = portalContainsElement;
//# sourceMappingURL=portalContainsElement.js.map