import { isVirtualElement } from './isVirtualElement';
/**
 * Gets the virtual parent given the child element, if it exists.
 *
 * @public
 */
export function getVirtualParent(child) {
    var parent;
    if (child && isVirtualElement(child)) {
        parent = child._virtual.parent;
    }
    return parent;
}
//# sourceMappingURL=getVirtualParent.js.map