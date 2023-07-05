/**
 * Returns a single function which will call each of the given functions in the context of the
 * parent.
 */
export declare function appendFunction(parent: any, ...functions: any[]): () => void;
