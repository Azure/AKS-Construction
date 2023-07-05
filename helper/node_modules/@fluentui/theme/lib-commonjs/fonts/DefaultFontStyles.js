"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDefaultFontFaces = exports.DefaultFontStyles = void 0;
var merge_styles_1 = require("@fluentui/merge-styles");
var FluentFonts_1 = require("./FluentFonts");
var createFontStyles_1 = require("./createFontStyles");
var utilities_1 = require("@fluentui/utilities");
// Default urls.
var DefaultBaseUrl = 'https://static2.sharepointonline.com/files/fabric/assets';
// Standard font styling.
exports.DefaultFontStyles = createFontStyles_1.createFontStyles(utilities_1.getLanguage());
function _registerFontFace(fontFamily, url, fontWeight, localFontName) {
    fontFamily = "'" + fontFamily + "'";
    var localFontSrc = localFontName !== undefined ? "local('" + localFontName + "')," : '';
    merge_styles_1.fontFace({
        fontFamily: fontFamily,
        src: localFontSrc + ("url('" + url + ".woff2') format('woff2'),") + ("url('" + url + ".woff') format('woff')"),
        fontWeight: fontWeight,
        fontStyle: 'normal',
        fontDisplay: 'swap',
    });
}
function _registerFontFaceSet(baseUrl, fontFamily, cdnFolder, cdnFontName, localFontName) {
    if (cdnFontName === void 0) { cdnFontName = 'segoeui'; }
    var urlBase = baseUrl + "/" + cdnFolder + "/" + cdnFontName;
    _registerFontFace(fontFamily, urlBase + '-light', FluentFonts_1.FontWeights.light, localFontName && localFontName + ' Light');
    _registerFontFace(fontFamily, urlBase + '-semilight', FluentFonts_1.FontWeights.semilight, localFontName && localFontName + ' SemiLight');
    _registerFontFace(fontFamily, urlBase + '-regular', FluentFonts_1.FontWeights.regular, localFontName);
    _registerFontFace(fontFamily, urlBase + '-semibold', FluentFonts_1.FontWeights.semibold, localFontName && localFontName + ' SemiBold');
    _registerFontFace(fontFamily, urlBase + '-bold', FluentFonts_1.FontWeights.bold, localFontName && localFontName + ' Bold');
}
function registerDefaultFontFaces(baseUrl) {
    if (baseUrl) {
        var fontUrl = baseUrl + "/fonts";
        // Produce @font-face definitions for all supported web fonts.
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Thai, 'leelawadeeui-thai', 'leelawadeeui');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Arabic, 'segoeui-arabic');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Cyrillic, 'segoeui-cyrillic');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.EastEuropean, 'segoeui-easteuropean');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Greek, 'segoeui-greek');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Hebrew, 'segoeui-hebrew');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Vietnamese, 'segoeui-vietnamese');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.WestEuropean, 'segoeui-westeuropean', 'segoeui', 'Segoe UI');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontFamilies.Selawik, 'selawik', 'selawik');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Armenian, 'segoeui-armenian');
        _registerFontFaceSet(fontUrl, FluentFonts_1.LocalizedFontNames.Georgian, 'segoeui-georgian');
        // Leelawadee UI (Thai) does not have a 'light' weight, so we override
        // the font-face generated above to use the 'semilight' weight instead.
        _registerFontFace('Leelawadee UI Web', fontUrl + "/leelawadeeui-thai/leelawadeeui-semilight", FluentFonts_1.FontWeights.light);
        // Leelawadee UI (Thai) does not have a 'semibold' weight, so we override
        // the font-face generated above to use the 'bold' weight instead.
        _registerFontFace('Leelawadee UI Web', fontUrl + "/leelawadeeui-thai/leelawadeeui-bold", FluentFonts_1.FontWeights.semibold);
    }
}
exports.registerDefaultFontFaces = registerDefaultFontFaces;
/**
 * Reads the fontBaseUrl from window.FabricConfig.fontBaseUrl or falls back to a default.
 */
function _getFontBaseUrl() {
    var _a, _b;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var fabricConfig = (_a = utilities_1.getWindow()) === null || _a === void 0 ? void 0 : _a.FabricConfig;
    return (_b = fabricConfig === null || fabricConfig === void 0 ? void 0 : fabricConfig.fontBaseUrl) !== null && _b !== void 0 ? _b : DefaultBaseUrl;
}
/**
 * Register the font faces.
 */
registerDefaultFontFaces(_getFontBaseUrl());
//# sourceMappingURL=DefaultFontStyles.js.map