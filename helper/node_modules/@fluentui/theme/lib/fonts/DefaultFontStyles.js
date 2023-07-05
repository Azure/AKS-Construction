import { fontFace } from '@fluentui/merge-styles';
import { FontWeights, LocalizedFontFamilies, LocalizedFontNames } from './FluentFonts';
import { createFontStyles } from './createFontStyles';
import { getLanguage, getWindow } from '@fluentui/utilities';
// Default urls.
var DefaultBaseUrl = 'https://static2.sharepointonline.com/files/fabric/assets';
// Standard font styling.
export var DefaultFontStyles = createFontStyles(getLanguage());
function _registerFontFace(fontFamily, url, fontWeight, localFontName) {
    fontFamily = "'" + fontFamily + "'";
    var localFontSrc = localFontName !== undefined ? "local('" + localFontName + "')," : '';
    fontFace({
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
    _registerFontFace(fontFamily, urlBase + '-light', FontWeights.light, localFontName && localFontName + ' Light');
    _registerFontFace(fontFamily, urlBase + '-semilight', FontWeights.semilight, localFontName && localFontName + ' SemiLight');
    _registerFontFace(fontFamily, urlBase + '-regular', FontWeights.regular, localFontName);
    _registerFontFace(fontFamily, urlBase + '-semibold', FontWeights.semibold, localFontName && localFontName + ' SemiBold');
    _registerFontFace(fontFamily, urlBase + '-bold', FontWeights.bold, localFontName && localFontName + ' Bold');
}
export function registerDefaultFontFaces(baseUrl) {
    if (baseUrl) {
        var fontUrl = baseUrl + "/fonts";
        // Produce @font-face definitions for all supported web fonts.
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Thai, 'leelawadeeui-thai', 'leelawadeeui');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Arabic, 'segoeui-arabic');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Cyrillic, 'segoeui-cyrillic');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.EastEuropean, 'segoeui-easteuropean');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Greek, 'segoeui-greek');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Hebrew, 'segoeui-hebrew');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Vietnamese, 'segoeui-vietnamese');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.WestEuropean, 'segoeui-westeuropean', 'segoeui', 'Segoe UI');
        _registerFontFaceSet(fontUrl, LocalizedFontFamilies.Selawik, 'selawik', 'selawik');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Armenian, 'segoeui-armenian');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Georgian, 'segoeui-georgian');
        // Leelawadee UI (Thai) does not have a 'light' weight, so we override
        // the font-face generated above to use the 'semilight' weight instead.
        _registerFontFace('Leelawadee UI Web', fontUrl + "/leelawadeeui-thai/leelawadeeui-semilight", FontWeights.light);
        // Leelawadee UI (Thai) does not have a 'semibold' weight, so we override
        // the font-face generated above to use the 'bold' weight instead.
        _registerFontFace('Leelawadee UI Web', fontUrl + "/leelawadeeui-thai/leelawadeeui-bold", FontWeights.semibold);
    }
}
/**
 * Reads the fontBaseUrl from window.FabricConfig.fontBaseUrl or falls back to a default.
 */
function _getFontBaseUrl() {
    var _a, _b;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var fabricConfig = (_a = getWindow()) === null || _a === void 0 ? void 0 : _a.FabricConfig;
    return (_b = fabricConfig === null || fabricConfig === void 0 ? void 0 : fabricConfig.fontBaseUrl) !== null && _b !== void 0 ? _b : DefaultBaseUrl;
}
/**
 * Register the font faces.
 */
registerDefaultFontFaces(_getFontBaseUrl());
//# sourceMappingURL=DefaultFontStyles.js.map