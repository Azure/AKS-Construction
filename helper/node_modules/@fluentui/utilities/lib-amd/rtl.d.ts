/**
 * Gets the rtl state of the page (returns true if in rtl.)
 */
export declare function getRTL(theme?: {
    rtl?: boolean;
}): boolean;
/**
 * Sets the rtl state of the page (by adjusting the dir attribute of the html element.)
 */
export declare function setRTL(isRTL: boolean, persistSetting?: boolean): void;
/**
 * Returns the given key, but flips right/left arrows if necessary.
 */
export declare function getRTLSafeKeyCode(key: number, theme?: {
    rtl?: boolean;
}): number;
