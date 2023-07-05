/**
 * Generates a unique id in the global scope (this spans across duplicate copies of the same library.)
 *
 * @public
 */
export declare function getId(prefix?: string): string;
/**
 * Resets id counter to an (optional) number.
 *
 * @public
 */
export declare function resetIds(counter?: number): void;
