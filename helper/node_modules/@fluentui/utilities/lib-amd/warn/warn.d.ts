export declare type ISettingsMap<T> = {
    [P in keyof T]?: string;
};
/**
 * Sends a warning to console, if the api is present.
 *
 * @public
 * @param message - Warning message.
 */
export declare function warn(message: string): void;
/**
 * Configures the warning callback. Passing in undefined will reset it to use the default
 * console.warn function.
 *
 * @public
 * @param warningCallback - Callback to override the generated warnings.
 */
export declare function setWarningCallback(warningCallback?: (message: string) => void): void;
