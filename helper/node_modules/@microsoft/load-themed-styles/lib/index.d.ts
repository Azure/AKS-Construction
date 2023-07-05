export interface IThemingInstruction {
    theme?: string;
    defaultValue?: string;
    rawString?: string;
}
export declare type ThemableArray = IThemingInstruction[];
export interface ITheme {
    [key: string]: string;
}
/**
 * In sync mode, styles are registered as style elements synchronously with loadStyles() call.
 * In async mode, styles are buffered and registered as batch in async timer for performance purpose.
 */
export declare const enum Mode {
    sync = 0,
    async = 1
}
/**
 * Themable styles and non-themable styles are tracked separately
 * Specify ClearStyleOptions when calling clearStyles API to specify which group of registered styles should be cleared.
 */
export declare const enum ClearStyleOptions {
    /** only themable styles will be cleared */
    onlyThemable = 1,
    /** only non-themable styles will be cleared */
    onlyNonThemable = 2,
    /** both themable and non-themable styles will be cleared */
    all = 3
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load
 * event is fired.
 * @param {string | ThemableArray} styles Themable style text to register.
 * @param {boolean} loadAsync When true, always load styles in async mode, irrespective of current sync mode.
 */
export declare function loadStyles(styles: string | ThemableArray, loadAsync?: boolean): void;
/**
 * Allows for customizable loadStyles logic. e.g. for server side rendering application
 * @param {(processedStyles: string, rawStyles?: string | ThemableArray) => void}
 * a loadStyles callback that gets called when styles are loaded or reloaded
 */
export declare function configureLoadStyles(loadStylesFn: ((processedStyles: string, rawStyles?: string | ThemableArray) => void) | undefined): void;
/**
 * Configure run mode of load-themable-styles
 * @param mode load-themable-styles run mode, async or sync
 */
export declare function configureRunMode(mode: Mode): void;
/**
 * external code can call flush to synchronously force processing of currently buffered styles
 */
export declare function flush(): void;
/**
 * Registers a set theme tokens to find and replace. If styles were already registered, they will be
 * replaced.
 * @param {theme} theme JSON object of theme tokens to values.
 */
export declare function loadTheme(theme: ITheme | undefined): void;
/**
 * Clear already registered style elements and style records in theme_State object
 * @param option - specify which group of registered styles should be cleared.
 * Default to be both themable and non-themable styles will be cleared
 */
export declare function clearStyles(option?: ClearStyleOptions): void;
/**
 * Find theme tokens and replaces them with provided theme values.
 * @param {string} styles Tokenized styles to fix.
 */
export declare function detokenize(styles: string | undefined): string | undefined;
/**
 * Split tokenized CSS into an array of strings and theme specification objects
 * @param {string} styles Tokenized styles to split.
 */
export declare function splitStyles(styles: string): ThemableArray;
//# sourceMappingURL=index.d.ts.map