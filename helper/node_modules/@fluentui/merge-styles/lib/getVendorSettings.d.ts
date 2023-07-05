export interface IVendorSettings {
    isWebkit?: boolean;
    isMoz?: boolean;
    isMs?: boolean;
    isOpera?: boolean;
}
export declare function getVendorSettings(): IVendorSettings;
/**
 * Sets the vendor settings for prefixing and vendor specific operations.
 */
export declare function setVendorSettings(vendorSettings?: IVendorSettings): void;
