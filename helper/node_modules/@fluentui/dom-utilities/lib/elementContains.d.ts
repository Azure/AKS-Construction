/**
 * Determines whether or not a parent element contains a given child element.
 * If `allowVirtualParents` is true, this method may return `true` if the child
 * has the parent in its virtual element hierarchy.
 *
 * @public
 */
export declare function elementContains(parent: HTMLElement | null, child: HTMLElement | null, allowVirtualParents?: boolean): boolean;
