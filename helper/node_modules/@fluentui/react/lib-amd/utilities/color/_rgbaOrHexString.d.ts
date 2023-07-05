/**
 * @internal
 * Get a CSS color string from some color components.
 * If `a` is specified and not 100, returns an `rgba()` string.
 * Otherwise returns `hex` prefixed with #.
 */
export declare function _rgbaOrHexString(r: number, g: number, b: number, a: number | undefined, hex: string): string;
