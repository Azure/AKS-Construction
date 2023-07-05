import { MAX_COLOR_ALPHA } from './consts';
import { hsv2rgb } from './hsv2rgb';
import { hsv2hex } from './hsv2hex';
import { _rgbaOrHexString } from './_rgbaOrHexString';
/**
 * Converts an HSV color (and optional alpha value) to a color object.
 * If `a` is not given, a default of 100 is used.
 * Hex in the returned value will *not* be prefixed with #.
 * If `a` is unspecified or 100, the result's `str` property will contain a hex value
 * (*not* prefixed with #)
 */
export function getColorFromHSV(hsv, a) {
    var h = hsv.h, s = hsv.s, v = hsv.v;
    a = typeof a === 'number' ? a : MAX_COLOR_ALPHA;
    var _a = hsv2rgb(h, s, v), r = _a.r, g = _a.g, b = _a.b;
    var hex = hsv2hex(h, s, v);
    var str = _rgbaOrHexString(r, g, b, a, hex);
    var t = MAX_COLOR_ALPHA - a;
    return { a: a, b: b, g: g, h: h, hex: hex, r: r, s: s, str: str, v: v, t: t };
}
//# sourceMappingURL=getColorFromHSV.js.map