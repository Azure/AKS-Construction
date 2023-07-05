import { getColorFromRGBA } from './getColorFromRGBA';
/**
 * Gets a color with a single RGBA component updated to a new value.
 * Does not modify the original `color`. Alpha defaults to 100 if not set.
 */
export function updateRGB(color, component, value) {
    var _a;
    return getColorFromRGBA((_a = {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
        },
        _a[component] = value,
        _a));
}
//# sourceMappingURL=updateRGB.js.map