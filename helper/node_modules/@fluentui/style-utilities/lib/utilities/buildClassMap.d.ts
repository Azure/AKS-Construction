/**
 * Builds a class names object from a given map.
 *
 * @param styles - Map of unprocessed styles.
 * @returns Map of property name to class name.
 */
export declare function buildClassMap<T extends Object>(styles: T): {
    [key in keyof T]?: string;
};
