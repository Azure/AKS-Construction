define(["require", "exports", "@fluentui/utilities", "./utilities/makeSemanticColors"], function (require, exports, utilities_1, makeSemanticColors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergeThemes = void 0;
    /**
     * Merge a partial/full theme into a full theme and returns a merged full theme.
     */
    function mergeThemes(theme, partialTheme) {
        var _a, _b, _c;
        if (partialTheme === void 0) { partialTheme = {}; }
        var mergedTheme = utilities_1.merge({}, theme, partialTheme, {
            semanticColors: makeSemanticColors_1.getSemanticColors(partialTheme.palette, partialTheme.effects, partialTheme.semanticColors, partialTheme.isInverted === undefined ? theme.isInverted : partialTheme.isInverted),
        });
        if (((_a = partialTheme.palette) === null || _a === void 0 ? void 0 : _a.themePrimary) && !((_b = partialTheme.palette) === null || _b === void 0 ? void 0 : _b.accent)) {
            mergedTheme.palette.accent = partialTheme.palette.themePrimary;
        }
        if (partialTheme.defaultFontStyle) {
            for (var _i = 0, _d = Object.keys(mergedTheme.fonts); _i < _d.length; _i++) {
                var fontStyle = _d[_i];
                mergedTheme.fonts[fontStyle] = utilities_1.merge(mergedTheme.fonts[fontStyle], partialTheme.defaultFontStyle, (_c = partialTheme === null || partialTheme === void 0 ? void 0 : partialTheme.fonts) === null || _c === void 0 ? void 0 : _c[fontStyle]);
            }
        }
        return mergedTheme;
    }
    exports.mergeThemes = mergeThemes;
});
//# sourceMappingURL=mergeThemes.js.map