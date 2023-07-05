import { getFocusStyle, hiddenContentStyle, HighContrastSelector, getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-RatingStar-root',
    rootIsSmall: 'ms-RatingStar-root--small',
    rootIsLarge: 'ms-RatingStar-root--large',
    ratingStar: 'ms-RatingStar-container',
    ratingStarBack: 'ms-RatingStar-back',
    ratingStarFront: 'ms-RatingStar-front',
    ratingButton: 'ms-Rating-button',
    ratingStarIsSmall: 'ms-Rating--small',
    ratingStartIsLarge: 'ms-Rating--large',
    labelText: 'ms-Rating-labelText',
    ratingFocusZone: 'ms-Rating-focuszone',
};
function _getColorWithHighContrast(color, highContrastColor) {
    var _a;
    return {
        color: color,
        selectors: (_a = {},
            _a[HighContrastSelector] = {
                color: highContrastColor,
            },
            _a),
    };
}
export function getStyles(props) {
    var disabled = props.disabled, readOnly = props.readOnly, theme = props.theme;
    var semanticColors = theme.semanticColors, palette = theme.palette;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    var ratingSmallIconSize = 16;
    var ratingLargeIconSize = 20;
    var ratingVerticalPadding = 8;
    var ratingHorizontalPadding = 2;
    var ratingStarUncheckedColor = palette.neutralSecondary;
    var ratingStarUncheckedHoverColor = palette.themePrimary;
    var ratingStarUncheckedHoverSelectedColor = palette.themeDark;
    var ratingStarCheckedColor = palette.neutralPrimary;
    var ratingStarDisabledColor = semanticColors.disabledBodySubtext;
    return {
        root: [
            classNames.root,
            theme.fonts.medium,
            !disabled &&
                !readOnly && {
                selectors: {
                    // This is part 1 of highlighting all stars up to the one the user is hovering over
                    '&:hover': {
                        selectors: {
                            '.ms-RatingStar-back': _getColorWithHighContrast(ratingStarCheckedColor, 'Highlight'),
                        },
                    },
                },
            },
        ],
        rootIsSmall: [
            classNames.rootIsSmall,
            {
                height: ratingSmallIconSize + ratingVerticalPadding * 2 + 'px',
            },
        ],
        rootIsLarge: [
            classNames.rootIsLarge,
            {
                height: ratingLargeIconSize + ratingVerticalPadding * 2 + 'px',
            },
        ],
        ratingStar: [
            classNames.ratingStar,
            {
                display: 'inline-block',
                position: 'relative',
                height: 'inherit',
            },
        ],
        ratingStarBack: [
            classNames.ratingStarBack,
            {
                // TODO: Use a proper semantic color for this
                color: ratingStarUncheckedColor,
                width: '100%',
            },
            disabled && _getColorWithHighContrast(ratingStarDisabledColor, 'GrayText'),
        ],
        ratingStarFront: [
            classNames.ratingStarFront,
            {
                position: 'absolute',
                height: '100 %',
                left: '0',
                top: '0',
                textAlign: 'center',
                verticalAlign: 'middle',
                overflow: 'hidden',
            },
            _getColorWithHighContrast(ratingStarCheckedColor, 'Highlight'),
        ],
        ratingButton: [
            getFocusStyle(theme),
            classNames.ratingButton,
            {
                backgroundColor: 'transparent',
                padding: ratingVerticalPadding + "px " + ratingHorizontalPadding + "px",
                boxSizing: 'content-box',
                margin: '0px',
                border: 'none',
                cursor: 'pointer',
                selectors: {
                    '&:disabled': {
                        cursor: 'default',
                    },
                    '&[disabled]': {
                        cursor: 'default',
                    },
                },
            },
            !disabled &&
                !readOnly && {
                selectors: {
                    // This is part 2 of highlighting all stars up to the one the user is hovering over
                    '&:hover ~ .ms-Rating-button': {
                        selectors: {
                            '.ms-RatingStar-back': _getColorWithHighContrast(ratingStarUncheckedColor, 'WindowText'),
                            '.ms-RatingStar-front': _getColorWithHighContrast(ratingStarUncheckedColor, 'WindowText'),
                        },
                    },
                    '&:hover': {
                        selectors: {
                            '.ms-RatingStar-back': {
                                color: ratingStarUncheckedHoverColor,
                            },
                            '.ms-RatingStar-front': {
                                color: ratingStarUncheckedHoverSelectedColor,
                            },
                        },
                    },
                },
            },
            disabled && {
                cursor: 'default',
            },
        ],
        ratingStarIsSmall: [
            classNames.ratingStarIsSmall,
            {
                fontSize: ratingSmallIconSize + 'px',
                lineHeight: ratingSmallIconSize + 'px',
                height: ratingSmallIconSize + 'px',
            },
        ],
        ratingStarIsLarge: [
            classNames.ratingStartIsLarge,
            {
                fontSize: ratingLargeIconSize + 'px',
                lineHeight: ratingLargeIconSize + 'px',
                height: ratingLargeIconSize + 'px',
            },
        ],
        labelText: [classNames.labelText, hiddenContentStyle],
        ratingFocusZone: [
            getFocusStyle(theme),
            classNames.ratingFocusZone,
            {
                display: 'inline-block',
            },
        ],
    };
}
//# sourceMappingURL=Rating.styles.js.map