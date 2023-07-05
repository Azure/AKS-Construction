/**
 * The helper functions here will make the target element as modal to screen readers, by placing aria-hidden on elements
 * that are siblings to the target element and the target element's ancestors (because aria-hidden gets inherited).
 * That way, all other elements on the page are hidden to the screen reader.
 */
/**
 * Call this on a target element to make it modal to screen readers.
 * Returns a function that undoes the changes it made.
 */
export declare function modalize(target: HTMLElement): () => void;
