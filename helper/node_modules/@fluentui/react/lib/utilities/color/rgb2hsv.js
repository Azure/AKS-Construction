import { MAX_COLOR_RGB } from './consts';
/** Converts RGB components to an HSV color. */
export function rgb2hsv(r, g, b) {
    var h = NaN;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
    // hue
    if (delta === 0) {
        h = 0;
    }
    else if (r === max) {
        h = ((g - b) / delta) % 6;
    }
    else if (g === max) {
        h = (b - r) / delta + 2;
    }
    else if (b === max) {
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }
    // saturation
    var s = Math.round((max === 0 ? 0 : delta / max) * 100);
    // value
    var v = Math.round((max / MAX_COLOR_RGB) * 100);
    return { h: h, s: s, v: v };
}
//# sourceMappingURL=rgb2hsv.js.map