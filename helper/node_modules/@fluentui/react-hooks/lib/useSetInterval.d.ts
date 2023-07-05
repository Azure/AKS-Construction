export declare type UseSetIntervalReturnType = {
    setInterval: (callback: () => void, duration: number) => number;
    clearInterval: (id: number) => void;
};
/**
 *  Returns a wrapper function for `setInterval` which automatically handles disposal.
 */
export declare const useSetInterval: () => UseSetIntervalReturnType;
