/** Converts HSL components to an HSV color. */
export function hsl2hsv(h, s, l) {
    s *= (l < 50 ? l : 100 - l) / 100;
    var v = l + s;
    return {
        h: h,
        s: v === 0 ? 0 : ((2 * s) / v) * 100,
        v: v,
    };
}
//# sourceMappingURL=hsl2hsv.js.map