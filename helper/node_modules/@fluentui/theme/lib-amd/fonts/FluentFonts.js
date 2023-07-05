define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IconFontSizes = exports.FontWeights = exports.FontSizes = exports.LocalizedFontFamilies = exports.LocalizedFontNames = void 0;
    // Font face names to be registered.
    var LocalizedFontNames;
    (function (LocalizedFontNames) {
        LocalizedFontNames.Arabic = 'Segoe UI Web (Arabic)';
        LocalizedFontNames.Cyrillic = 'Segoe UI Web (Cyrillic)';
        LocalizedFontNames.EastEuropean = 'Segoe UI Web (East European)';
        LocalizedFontNames.Greek = 'Segoe UI Web (Greek)';
        LocalizedFontNames.Hebrew = 'Segoe UI Web (Hebrew)';
        LocalizedFontNames.Thai = 'Leelawadee UI Web';
        LocalizedFontNames.Vietnamese = 'Segoe UI Web (Vietnamese)';
        LocalizedFontNames.WestEuropean = 'Segoe UI Web (West European)';
        LocalizedFontNames.Selawik = 'Selawik Web';
        LocalizedFontNames.Armenian = 'Segoe UI Web (Armenian)';
        LocalizedFontNames.Georgian = 'Segoe UI Web (Georgian)';
    })(LocalizedFontNames = exports.LocalizedFontNames || (exports.LocalizedFontNames = {}));
    // Font families with fallbacks, for the general regions.
    var LocalizedFontFamilies;
    (function (LocalizedFontFamilies) {
        LocalizedFontFamilies.Arabic = "'" + LocalizedFontNames.Arabic + "'";
        LocalizedFontFamilies.ChineseSimplified = "'Microsoft Yahei UI', Verdana, Simsun";
        LocalizedFontFamilies.ChineseTraditional = "'Microsoft Jhenghei UI', Pmingliu";
        LocalizedFontFamilies.Cyrillic = "'" + LocalizedFontNames.Cyrillic + "'";
        LocalizedFontFamilies.EastEuropean = "'" + LocalizedFontNames.EastEuropean + "'";
        LocalizedFontFamilies.Greek = "'" + LocalizedFontNames.Greek + "'";
        LocalizedFontFamilies.Hebrew = "'" + LocalizedFontNames.Hebrew + "'";
        LocalizedFontFamilies.Hindi = "'Nirmala UI'";
        LocalizedFontFamilies.Japanese = "'Yu Gothic UI', 'Meiryo UI', Meiryo, 'MS Pgothic', Osaka";
        LocalizedFontFamilies.Korean = "'Malgun Gothic', Gulim";
        LocalizedFontFamilies.Selawik = "'" + LocalizedFontNames.Selawik + "'";
        LocalizedFontFamilies.Thai = "'Leelawadee UI Web', 'Kmer UI'";
        LocalizedFontFamilies.Vietnamese = "'" + LocalizedFontNames.Vietnamese + "'";
        LocalizedFontFamilies.WestEuropean = "'" + LocalizedFontNames.WestEuropean + "'";
        LocalizedFontFamilies.Armenian = "'" + LocalizedFontNames.Armenian + "'";
        LocalizedFontFamilies.Georgian = "'" + LocalizedFontNames.Georgian + "'";
    })(LocalizedFontFamilies = exports.LocalizedFontFamilies || (exports.LocalizedFontFamilies = {}));
    // Standard font sizes.
    var FontSizes;
    (function (FontSizes) {
        FontSizes.size10 = '10px';
        FontSizes.size12 = '12px';
        FontSizes.size14 = '14px';
        FontSizes.size16 = '16px';
        FontSizes.size18 = '18px';
        FontSizes.size20 = '20px';
        FontSizes.size24 = '24px';
        FontSizes.size28 = '28px';
        FontSizes.size32 = '32px';
        FontSizes.size42 = '42px';
        FontSizes.size68 = '68px';
        FontSizes.mini = '10px';
        FontSizes.xSmall = '10px';
        FontSizes.small = '12px';
        FontSizes.smallPlus = '12px';
        FontSizes.medium = '14px';
        FontSizes.mediumPlus = '16px';
        FontSizes.icon = '16px';
        FontSizes.large = '18px';
        FontSizes.xLarge = '20px';
        FontSizes.xLargePlus = '24px';
        FontSizes.xxLarge = '28px';
        FontSizes.xxLargePlus = '32px';
        FontSizes.superLarge = '42px';
        FontSizes.mega = '68px';
    })(FontSizes = exports.FontSizes || (exports.FontSizes = {}));
    // Standard font weights.
    var FontWeights;
    (function (FontWeights) {
        FontWeights.light = 100;
        FontWeights.semilight = 300;
        FontWeights.regular = 400;
        FontWeights.semibold = 600;
        FontWeights.bold = 700;
    })(FontWeights = exports.FontWeights || (exports.FontWeights = {}));
    // Standard Icon Sizes.
    var IconFontSizes;
    (function (IconFontSizes) {
        IconFontSizes.xSmall = '10px';
        IconFontSizes.small = '12px';
        IconFontSizes.medium = '16px';
        IconFontSizes.large = '20px';
    })(IconFontSizes = exports.IconFontSizes || (exports.IconFontSizes = {}));
});
//# sourceMappingURL=FluentFonts.js.map