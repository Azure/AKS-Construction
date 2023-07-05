import { hsv2rgb } from './hsv2rgb';
import { rgb2hex } from './rgb2hex';
/** Converts HSV components to a hex color string (without # prefix). */
export function hsv2hex(h, s, v) {
    var _a = hsv2rgb(h, s, v), r = _a.r, g = _a.g, b = _a.b;
    return rgb2hex(r, g, b);
}
//# sourceMappingURL=hsv2hex.js.map