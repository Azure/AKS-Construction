/**
 * Simple deep merge function. Takes all arguments and returns a deep copy of the objects merged
 * together in the order provided. If an object creates a circular reference, it will assign the
 * original reference.
 */
export declare function merge<T = {}>(target: Partial<T>, ...args: (Partial<T> | null | undefined | false)[]): T;
