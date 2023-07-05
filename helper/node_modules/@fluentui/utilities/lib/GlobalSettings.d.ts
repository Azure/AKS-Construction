/**
 * Change description used for change callbacks in GlobalSettings.
 *
 * @public
 * {@docCategory IChangeDescription}
 */
export interface IChangeDescription {
    key: string;
    oldValue: any;
    value: any;
}
/**
 * Change event callback.
 *
 * @public
 * {@docCategory IChangeEventCallback}
 */
export interface IChangeEventCallback {
    __id__?: string;
    (changeDescription?: IChangeDescription): void;
}
/**
 * Global settings helper, which stores settings in the global (window) namespace.
 * If window is not provided, it will store settings in module scope. Provides a
 * way to observe changes as well when their values change.
 *
 * @public
 * {@docCategory GlobalSettings}
 */
export declare class GlobalSettings {
    static getValue<T>(key: string, defaultValue?: T | (() => T)): T;
    static setValue<T>(key: string, value: T): T;
    static addChangeListener(cb: IChangeEventCallback): void;
    static removeChangeListener(cb: IChangeEventCallback): void;
}
