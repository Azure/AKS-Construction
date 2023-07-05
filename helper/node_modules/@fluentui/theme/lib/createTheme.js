import { DefaultPalette } from './colors/index';
import { DefaultEffects } from './effects/index';
import { DefaultFontStyles } from './fonts/index';
import { mergeThemes } from './mergeThemes';
import { DefaultSpacing } from './spacing/index';
import { makeSemanticColors } from './utilities/makeSemanticColors';
/**
 * Creates a custom theme definition.
 * @param theme - Partial theme object.
 * @param depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
export function createTheme(theme, depComments) {
    if (theme === void 0) { theme = {}; }
    if (depComments === void 0) { depComments = false; }
    var isInverted = !!theme.isInverted;
    var baseTheme = {
        palette: DefaultPalette,
        effects: DefaultEffects,
        fonts: DefaultFontStyles,
        spacing: DefaultSpacing,
        isInverted: isInverted,
        disableGlobalClassNames: false,
        semanticColors: makeSemanticColors(DefaultPalette, DefaultEffects, undefined, isInverted, depComments),
        rtl: undefined,
    };
    return mergeThemes(baseTheme, theme);
}
//# sourceMappingURL=createTheme.js.map