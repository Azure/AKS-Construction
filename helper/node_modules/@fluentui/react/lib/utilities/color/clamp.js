/** Clamp a value to ensure it falls within a given range. */
export function clamp(value, max, min) {
    if (min === void 0) { min = 0; }
    return value < min ? min : value > max ? max : value;
}
//# sourceMappingURL=clamp.js.map