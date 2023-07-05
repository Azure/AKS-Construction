import * as React from 'react';
/**
 * A Ref function which can be treated like a ref object in that it has an attached
 * current property, which will be updated as the ref is evaluated.
 */
export declare type RefObjectFunction<T> = React.RefObject<T> & ((value: T) => void);
/**
 * React hook to merge multiple React refs (either MutableRefObjects or ref callbacks) into a single ref callback that
 * updates all provided refs
 * @param refs - Refs to collectively update with one ref value.
 * @returns A function with an attached "current" prop, so that it can be treated like a RefObject.
 */
export declare function useMergedRefs<T>(...refs: (React.Ref<T> | undefined)[]): RefObjectFunction<T>;
