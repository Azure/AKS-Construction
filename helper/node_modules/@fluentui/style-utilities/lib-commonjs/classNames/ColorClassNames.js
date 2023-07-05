"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorClassNames = void 0;
var merge_styles_1 = require("@fluentui/merge-styles");
var DefaultPalette_1 = require("../styles/DefaultPalette");
var index_1 = require("../styles/index");
exports.ColorClassNames = {};
for (var colorName in DefaultPalette_1.DefaultPalette) {
    if (DefaultPalette_1.DefaultPalette.hasOwnProperty(colorName)) {
        // Foreground color
        _defineGetter(exports.ColorClassNames, colorName, '', false, 'color');
        // Hover color
        _defineGetter(exports.ColorClassNames, colorName, 'Hover', true, 'color');
        // Background color
        _defineGetter(exports.ColorClassNames, colorName, 'Background', false, 'background');
        // Background hover
        _defineGetter(exports.ColorClassNames, colorName, 'BackgroundHover', true, 'background');
        // Border color
        _defineGetter(exports.ColorClassNames, colorName, 'Border', false, 'borderColor');
        // Border hover color
        _defineGetter(exports.ColorClassNames, colorName, 'BorderHover', true, 'borderColor');
    }
}
/**
 * Defines a getter for the given class configuration.
 */
function _defineGetter(obj, colorName, suffix, isHover, cssProperty) {
    Object.defineProperty(obj, colorName + suffix, {
        get: function () {
            var _a;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var style = (_a = {}, _a[cssProperty] = index_1.getTheme().palette[colorName], _a);
            return merge_styles_1.mergeStyles(isHover ? { selectors: { ':hover': style } } : style).toString();
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=ColorClassNames.js.map