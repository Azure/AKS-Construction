/**
 * Helper to find the index of an item within an array, using a callback to
 * determine the match.
 *
 * @public
 * @param array - Array to search.
 * @param cb - Callback which returns true on matches.
 * @param fromIndex - Optional index to start from (defaults to 0)
 */
export declare function findIndex<T>(array: T[], cb: (item: T, index: number) => boolean, fromIndex?: number): number;
/**
 * Helper to find the first item within an array that satisfies the callback.
 * @param array - Array to search
 * @param cb - Callback which returns true on matches
 */
export declare function find<T>(array: T[], cb: (item: T, index: number) => boolean): T | undefined;
/**
 * Creates an array of a given size and helper method to populate.
 *
 * @public
 * @param size - Size of array.
 * @param getItem - Callback to populate given cell index.
 */
export declare function createArray<T>(size: number, getItem: (index: number) => T): T[];
/**
 * Convert the given array to a matrix with columnCount number
 * of columns.
 *
 * @public
 * @param items - The array to convert
 * @param columnCount - The number of columns for the resulting matrix
 * @returns A matrix of items
 */
export declare function toMatrix<T>(items: T[], columnCount: number): T[][];
/**
 * Given an array, it returns a new array that does not contain the item at the given index.
 * @param array - The array to operate on
 * @param index - The index of the element to remove
 */
export declare function removeIndex<T>(array: T[], index: number): T[];
/**
 * Given an array, this function returns a new array where the element at a given index has been replaced.
 * @param array - The array to operate on
 * @param newElement - The element that will be placed in the new array
 * @param index - The index of the element that should be replaced
 */
export declare function replaceElement<T>(array: T[], newElement: T, index: number): T[];
/**
 * Given an array, this function returns a new array where an element has been inserted at the given index.
 * @param array - The array to operate on
 * @param index - The index where an element should be inserted
 * @param itemToAdd - The element to insert
 */
export declare function addElementAtIndex<T>(array: T[], index: number, itemToAdd: T): T[];
/**
 * Given an array where each element is of type T or T[], flatten it into an array of T
 * @param array - The array where each element can optionally also be an array
 */
export declare function flatten<T>(array: (T | T[])[]): T[];
/**
 * Returns a boolean indicating if the two given arrays are equal in length and values.
 *
 * @param array1 - First array to compare
 * @param array2 - Second array to compare
 * @returns True if the arrays are the same length and have the same values in the same positions, false otherwise.
 */
export declare function arraysEqual<T>(array1: T[], array2: T[]): boolean;
