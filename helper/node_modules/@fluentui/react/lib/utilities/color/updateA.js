import { __assign } from "tslib";
import { _rgbaOrHexString } from './_rgbaOrHexString';
import { MAX_COLOR_ALPHA } from './consts';
/**
 * Gets a color with the given alpha value and the same other components as `color`.
 * Does not modify the original color.
 */
export function updateA(color, a) {
    return __assign(__assign({}, color), { a: a, t: MAX_COLOR_ALPHA - a, str: _rgbaOrHexString(color.r, color.g, color.b, a, color.hex) });
}
//# sourceMappingURL=updateA.js.map