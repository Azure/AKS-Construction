define(["require", "exports", "./FluentFonts"], function (require, exports, FluentFonts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createFontStyles = void 0;
    // Fallback fonts, if specified system or web fonts are unavailable.
    var FontFamilyFallbacks = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif";
    // By default, we favor system fonts for the default.
    // All localized fonts use a web font and never use the system font.
    var defaultFontFamily = "'Segoe UI', '" + FluentFonts_1.LocalizedFontNames.WestEuropean + "'";
    // Mapping of language prefix to to font family.
    var LanguageToFontMap = {
        ar: FluentFonts_1.LocalizedFontFamilies.Arabic,
        bg: FluentFonts_1.LocalizedFontFamilies.Cyrillic,
        cs: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        el: FluentFonts_1.LocalizedFontFamilies.Greek,
        et: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        he: FluentFonts_1.LocalizedFontFamilies.Hebrew,
        hi: FluentFonts_1.LocalizedFontFamilies.Hindi,
        hr: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        hu: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        ja: FluentFonts_1.LocalizedFontFamilies.Japanese,
        kk: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        ko: FluentFonts_1.LocalizedFontFamilies.Korean,
        lt: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        lv: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        pl: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        ru: FluentFonts_1.LocalizedFontFamilies.Cyrillic,
        sk: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        'sr-latn': FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        th: FluentFonts_1.LocalizedFontFamilies.Thai,
        tr: FluentFonts_1.LocalizedFontFamilies.EastEuropean,
        uk: FluentFonts_1.LocalizedFontFamilies.Cyrillic,
        vi: FluentFonts_1.LocalizedFontFamilies.Vietnamese,
        'zh-hans': FluentFonts_1.LocalizedFontFamilies.ChineseSimplified,
        'zh-hant': FluentFonts_1.LocalizedFontFamilies.ChineseTraditional,
        hy: FluentFonts_1.LocalizedFontFamilies.Armenian,
        ka: FluentFonts_1.LocalizedFontFamilies.Georgian,
    };
    function _fontFamilyWithFallbacks(fontFamily) {
        return fontFamily + ", " + FontFamilyFallbacks;
    }
    /**
     * If there is a localized font for this language, return that.
     * Returns undefined if there is no localized font for that language.
     */
    function _getLocalizedFontFamily(language) {
        for (var lang in LanguageToFontMap) {
            if (LanguageToFontMap.hasOwnProperty(lang) && language && lang.indexOf(language) === 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return LanguageToFontMap[lang];
            }
        }
        return defaultFontFamily;
    }
    function _createFont(size, weight, fontFamily) {
        return {
            fontFamily: fontFamily,
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontSize: size,
            fontWeight: weight,
        };
    }
    function createFontStyles(localeCode) {
        var localizedFont = _getLocalizedFontFamily(localeCode);
        var fontFamilyWithFallback = _fontFamilyWithFallbacks(localizedFont);
        var fontStyles = {
            tiny: _createFont(FluentFonts_1.FontSizes.mini, FluentFonts_1.FontWeights.regular, fontFamilyWithFallback),
            xSmall: _createFont(FluentFonts_1.FontSizes.xSmall, FluentFonts_1.FontWeights.regular, fontFamilyWithFallback),
            small: _createFont(FluentFonts_1.FontSizes.small, FluentFonts_1.FontWeights.regular, fontFamilyWithFallback),
            smallPlus: _createFont(FluentFonts_1.FontSizes.smallPlus, FluentFonts_1.FontWeights.regular, fontFamilyWithFallback),
            medium: _createFont(FluentFonts_1.FontSizes.medium, FluentFonts_1.FontWeights.regular, fontFamilyWithFallback),
            mediumPlus: _createFont(FluentFonts_1.FontSizes.mediumPlus, FluentFonts_1.FontWeights.regular, fontFamilyWithFallback),
            large: _createFont(FluentFonts_1.FontSizes.large, FluentFonts_1.FontWeights.regular, fontFamilyWithFallback),
            xLarge: _createFont(FluentFonts_1.FontSizes.xLarge, FluentFonts_1.FontWeights.semibold, fontFamilyWithFallback),
            xLargePlus: _createFont(FluentFonts_1.FontSizes.xLargePlus, FluentFonts_1.FontWeights.semibold, fontFamilyWithFallback),
            xxLarge: _createFont(FluentFonts_1.FontSizes.xxLarge, FluentFonts_1.FontWeights.semibold, fontFamilyWithFallback),
            xxLargePlus: _createFont(FluentFonts_1.FontSizes.xxLargePlus, FluentFonts_1.FontWeights.semibold, fontFamilyWithFallback),
            superLarge: _createFont(FluentFonts_1.FontSizes.superLarge, FluentFonts_1.FontWeights.semibold, fontFamilyWithFallback),
            mega: _createFont(FluentFonts_1.FontSizes.mega, FluentFonts_1.FontWeights.semibold, fontFamilyWithFallback),
        };
        return fontStyles;
    }
    exports.createFontStyles = createFontStyles;
});
//# sourceMappingURL=createFontStyles.js.map