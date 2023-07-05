/**
 * Gets the element which is the parent of a given element.
 * If `allowVirtuaParents` is `true`, this method prefers the virtual parent over
 * real DOM parent when present.
 *
 * @public
 */
export declare function getParent(child: HTMLElement, allowVirtualParents?: boolean): HTMLElement | null;
