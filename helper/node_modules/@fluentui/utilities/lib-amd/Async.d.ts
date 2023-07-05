/**
 * Bugs often appear in async code when stuff gets disposed, but async operations don't get canceled.
 * This Async helper class solves these issues by tying async code to the lifetime of a disposable object.
 *
 * Usage: Anything class extending from BaseModel can access this helper via this.async. Otherwise create a
 * new instance of the class and remember to call dispose() during your code's dispose handler.
 *
 * @public
 */
export declare class Async {
    private _timeoutIds;
    private _immediateIds;
    private _intervalIds;
    private _animationFrameIds;
    private _isDisposed;
    private _parent;
    private _onErrorHandler;
    private _noop;
    constructor(parent?: object, onError?: (e: any) => void);
    /**
     * Dispose function, clears all async operations.
     */
    dispose(): void;
    /**
     * SetTimeout override, which will auto cancel the timeout during dispose.
     * @param callback - Callback to execute.
     * @param duration - Duration in milliseconds.
     * @returns The setTimeout id.
     */
    setTimeout(callback: () => void, duration: number): number;
    /**
     * Clears the timeout.
     * @param id - Id to cancel.
     */
    clearTimeout(id: number): void;
    /**
     * SetImmediate override, which will auto cancel the immediate during dispose.
     * @param callback - Callback to execute.
     * @param targetElement - Optional target element to use for identifying the correct window.
     * @returns The setTimeout id.
     */
    setImmediate(callback: () => void, targetElement?: Element | null): number;
    /**
     * Clears the immediate.
     * @param id - Id to cancel.
     * @param targetElement - Optional target element to use for identifying the correct window.
     */
    clearImmediate(id: number, targetElement?: Element | null): void;
    /**
     * SetInterval override, which will auto cancel the timeout during dispose.
     * @param callback - Callback to execute.
     * @param duration - Duration in milliseconds.
     * @returns The setTimeout id.
     */
    setInterval(callback: () => void, duration: number): number;
    /**
     * Clears the interval.
     * @param id - Id to cancel.
     */
    clearInterval(id: number): void;
    /**
     * Creates a function that, when executed, will only call the func function at most once per
     * every wait milliseconds. Provide an options object to indicate that func should be invoked
     * on the leading and/or trailing edge of the wait timeout. Subsequent calls to the throttled
     * function will return the result of the last func call.
     *
     * Note: If leading and trailing options are true func will be called on the trailing edge of
     * the timeout only if the throttled function is invoked more than once during the wait timeout.
     *
     * @param func - The function to throttle.
     * @param wait - The number of milliseconds to throttle executions to. Defaults to 0.
     * @param options - The options object.
     * @returns The new throttled function.
     */
    throttle<T extends (...args: any[]) => any>(func: T, wait?: number, options?: {
        leading?: boolean;
        trailing?: boolean;
    }): T;
    /**
     * Creates a function that will delay the execution of func until after wait milliseconds have
     * elapsed since the last time it was invoked. Provide an options object to indicate that func
     * should be invoked on the leading and/or trailing edge of the wait timeout. Subsequent calls
     * to the debounced function will return the result of the last func call.
     *
     * Note: If leading and trailing options are true func will be called on the trailing edge of
     * the timeout only if the debounced function is invoked more than once during the wait
     * timeout.
     *
     * @param func - The function to debounce.
     * @param wait - The number of milliseconds to delay.
     * @param options - The options object.
     * @returns The new debounced function.
     */
    debounce<T extends (...args: any[]) => any>(func: T, wait?: number, options?: {
        leading?: boolean;
        maxWait?: number;
        trailing?: boolean;
    }): ICancelable<T> & T;
    requestAnimationFrame(callback: () => void, targetElement?: Element | null): number;
    cancelAnimationFrame(id: number, targetElement?: Element | null): void;
    protected _logError(e: any): void;
}
export declare type ICancelable<T extends (...args: any[]) => any> = {
    flush: () => ReturnType<T>;
    cancel: () => void;
    pending: () => boolean;
};
