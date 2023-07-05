/**
 * ARIA helper to concatenate attributes, returning undefined if all attributes
 * are undefined. (Empty strings are not a valid ARIA attribute value.)
 *
 * @param ariaAttributes - ARIA attributes to merge
 */
export declare function mergeAriaAttributeValues(...ariaAttributes: (string | undefined | false)[]): string | undefined;
