import { MAX_COLOR_ALPHA } from './consts';
import { rgb2hsv } from './rgb2hsv';
import { rgb2hex } from './rgb2hex';
import { _rgbaOrHexString } from './_rgbaOrHexString';
/** Converts an RGBA color to a color object (alpha defaults to 100). */
export function getColorFromRGBA(rgba) {
    var _a = rgba.a, a = _a === void 0 ? MAX_COLOR_ALPHA : _a, b = rgba.b, g = rgba.g, r = rgba.r;
    var _b = rgb2hsv(r, g, b), h = _b.h, s = _b.s, v = _b.v;
    var hex = rgb2hex(r, g, b);
    var str = _rgbaOrHexString(r, g, b, a, hex);
    var t = MAX_COLOR_ALPHA - a;
    return { a: a, b: b, g: g, h: h, hex: hex, r: r, s: s, str: str, v: v, t: t };
}
//# sourceMappingURL=getColorFromRGBA.js.map