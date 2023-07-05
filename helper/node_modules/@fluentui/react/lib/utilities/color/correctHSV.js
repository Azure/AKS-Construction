import { MAX_COLOR_HUE, MAX_COLOR_SATURATION, MAX_COLOR_VALUE } from './consts';
import { clamp } from './clamp';
/** Corrects an HSV color to fall within the valid range. */
export function correctHSV(color) {
    return {
        h: clamp(color.h, MAX_COLOR_HUE),
        s: clamp(color.s, MAX_COLOR_SATURATION),
        v: clamp(color.v, MAX_COLOR_VALUE),
    };
}
//# sourceMappingURL=correctHSV.js.map