/**
 * Determine whether a target is within a portal from perspective of root or optional parent.
 * This function only works against portal components that use the setPortalAttribute function.
 * If both parent and child are within the same portal this function will return false.
 * @param target - Element to query portal containment status of.
 * @param parent - Optional parent perspective. Search for containing portal stops at parent
 * (or root if parent is undefined or invalid.)
 */
export declare function portalContainsElement(target: HTMLElement, parent?: HTMLElement): boolean;
