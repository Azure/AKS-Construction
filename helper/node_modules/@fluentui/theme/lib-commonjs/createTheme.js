"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheme = void 0;
var index_1 = require("./colors/index");
var index_2 = require("./effects/index");
var index_3 = require("./fonts/index");
var mergeThemes_1 = require("./mergeThemes");
var index_4 = require("./spacing/index");
var makeSemanticColors_1 = require("./utilities/makeSemanticColors");
/**
 * Creates a custom theme definition.
 * @param theme - Partial theme object.
 * @param depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
function createTheme(theme, depComments) {
    if (theme === void 0) { theme = {}; }
    if (depComments === void 0) { depComments = false; }
    var isInverted = !!theme.isInverted;
    var baseTheme = {
        palette: index_1.DefaultPalette,
        effects: index_2.DefaultEffects,
        fonts: index_3.DefaultFontStyles,
        spacing: index_4.DefaultSpacing,
        isInverted: isInverted,
        disableGlobalClassNames: false,
        semanticColors: makeSemanticColors_1.makeSemanticColors(index_1.DefaultPalette, index_2.DefaultEffects, undefined, isInverted, depComments),
        rtl: undefined,
    };
    return mergeThemes_1.mergeThemes(baseTheme, theme);
}
exports.createTheme = createTheme;
//# sourceMappingURL=createTheme.js.map