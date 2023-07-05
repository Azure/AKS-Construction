export declare type UseSetTimeoutReturnType = {
    setTimeout: (callback: () => void, duration: number) => number;
    clearTimeout: (id: number) => void;
};
/**
 *  Returns a wrapper function for `setTimeout` which automatically handles disposal.
 */
export declare const useSetTimeout: () => UseSetTimeoutReturnType;
