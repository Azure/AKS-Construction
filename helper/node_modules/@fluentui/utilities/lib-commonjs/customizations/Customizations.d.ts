export declare type ISettings = {
    [key: string]: any;
};
export declare type ISettingsFunction = (settings: ISettings) => ISettings;
/**
 * @deprecated Use ISettings.
 */
export declare type Settings = ISettings;
/**
 * @deprecated Use ISettingsFunction.
 */
export declare type SettingsFunction = ISettingsFunction;
export interface ICustomizations {
    settings: ISettings;
    scopedSettings: {
        [key: string]: ISettings;
    };
    inCustomizerContext?: boolean;
}
export declare class Customizations {
    private static _suppressUpdates;
    static reset(): void;
    /** Apply global Customization settings.
     * @example Customizations.applySettings(\{ theme: \{...\} \});
     */
    static applySettings(settings: ISettings): void;
    /** Apply Customizations to a particular named scope, like a component.
     * @example Customizations.applyScopedSettings('Nav', \{ styles: () =\> \{\} \});
     */
    static applyScopedSettings(scopeName: string, settings: ISettings): void;
    static getSettings(properties: string[], scopeName?: string, localSettings?: ICustomizations): any;
    /** Used to run some code that sets Customizations without triggering an update until the end.
     * Useful for applying Customizations that don't affect anything currently rendered, or for
     * applying many customizations at once.
     * @param suppressUpdate - Do not raise the change event at the end, preventing all updates
     */
    static applyBatchedUpdates(code: () => void, suppressUpdate?: boolean): void;
    static observe(onChange: () => void): void;
    static unobserve(onChange: () => void): void;
    private static _raiseChange;
}
