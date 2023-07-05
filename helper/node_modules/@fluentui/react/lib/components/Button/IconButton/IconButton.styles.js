import { concatStyleSets, HighContrastSelector } from '../../../Styling';
import { memoizeFunction } from '../../../Utilities';
import { getStyles as getBaseButtonStyles } from '../BaseButton.styles';
import { getStyles as getSplitButtonStyles } from '../SplitButton/SplitButton.styles';
export var getStyles = memoizeFunction(function (theme, customStyles) {
    var _a;
    var baseButtonStyles = getBaseButtonStyles(theme);
    var splitButtonStyles = getSplitButtonStyles(theme);
    var palette = theme.palette, semanticColors = theme.semanticColors;
    var iconButtonStyles = {
        root: {
            padding: '0 4px',
            width: '32px',
            height: '32px',
            backgroundColor: 'transparent',
            border: 'none',
            color: semanticColors.link,
        },
        rootHovered: {
            color: palette.themeDarkAlt,
            backgroundColor: palette.neutralLighter,
            selectors: (_a = {},
                _a[HighContrastSelector] = {
                    borderColor: 'Highlight',
                    color: 'Highlight',
                },
                _a),
        },
        rootHasMenu: {
            width: 'auto',
        },
        rootPressed: {
            color: palette.themeDark,
            backgroundColor: palette.neutralLight,
        },
        rootExpanded: {
            color: palette.themeDark,
            backgroundColor: palette.neutralLight,
        },
        rootChecked: {
            color: palette.themeDark,
            backgroundColor: palette.neutralLight,
        },
        rootCheckedHovered: {
            color: palette.themeDark,
            backgroundColor: palette.neutralQuaternaryAlt,
        },
        rootDisabled: {
            color: palette.neutralTertiaryAlt,
        },
    };
    return concatStyleSets(baseButtonStyles, iconButtonStyles, splitButtonStyles, customStyles);
});
//# sourceMappingURL=IconButton.styles.js.map