import { mergeStyles } from '@fluentui/merge-styles';
import { DefaultPalette } from '../styles/DefaultPalette';
import { getTheme } from '../styles/index';
export var ColorClassNames = {};
for (var colorName in DefaultPalette) {
    if (DefaultPalette.hasOwnProperty(colorName)) {
        // Foreground color
        _defineGetter(ColorClassNames, colorName, '', false, 'color');
        // Hover color
        _defineGetter(ColorClassNames, colorName, 'Hover', true, 'color');
        // Background color
        _defineGetter(ColorClassNames, colorName, 'Background', false, 'background');
        // Background hover
        _defineGetter(ColorClassNames, colorName, 'BackgroundHover', true, 'background');
        // Border color
        _defineGetter(ColorClassNames, colorName, 'Border', false, 'borderColor');
        // Border hover color
        _defineGetter(ColorClassNames, colorName, 'BorderHover', true, 'borderColor');
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
            var style = (_a = {}, _a[cssProperty] = getTheme().palette[colorName], _a);
            return mergeStyles(isHover ? { selectors: { ':hover': style } } : style).toString();
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=ColorClassNames.js.map