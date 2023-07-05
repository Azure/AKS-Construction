import { MAX_COLOR_ALPHA } from './consts';
/**
 * @internal
 * Get a CSS color string from some color components.
 * If `a` is specified and not 100, returns an `rgba()` string.
 * Otherwise returns `hex` prefixed with #.
 */
export function _rgbaOrHexString(r, g, b, a, hex) {
    return a === MAX_COLOR_ALPHA || typeof a !== 'number' ? "#" + hex : "rgba(" + r + ", " + g + ", " + b + ", " + a / MAX_COLOR_ALPHA + ")";
}
//# sourceMappingURL=_rgbaOrHexString.js.map