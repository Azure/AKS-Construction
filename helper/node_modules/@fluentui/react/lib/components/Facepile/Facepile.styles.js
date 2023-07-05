import { hiddenContentStyle, HighContrastSelector, getFocusStyle, getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-Facepile',
    addButton: 'ms-Facepile-addButton ms-Facepile-itemButton',
    descriptiveOverflowButton: 'ms-Facepile-descriptiveOverflowButton ms-Facepile-itemButton',
    itemButton: 'ms-Facepile-itemButton ms-Facepile-person',
    itemContainer: 'ms-Facepile-itemContainer',
    members: 'ms-Facepile-members',
    member: 'ms-Facepile-member',
    overflowButton: 'ms-Facepile-overflowButton ms-Facepile-itemButton',
};
export var styles = function (props) {
    var _a;
    var className = props.className, theme = props.theme, _b = props.spacingAroundItemButton, spacingAroundItemButton = _b === void 0 ? 2 : _b;
    var palette = theme.palette, fonts = theme.fonts;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    var ItemButtonStyles = {
        textAlign: 'center',
        padding: 0,
        borderRadius: '50%',
        verticalAlign: 'top',
        display: 'inline',
        backgroundColor: 'transparent',
        border: 'none',
        selectors: {
            '&::-moz-focus-inner': {
                padding: 0,
                border: 0,
            },
        },
    };
    return {
        root: [
            classNames.root,
            theme.fonts.medium,
            {
                width: 'auto',
            },
            className,
        ],
        addButton: [
            classNames.addButton,
            getFocusStyle(theme, { inset: -1 }),
            ItemButtonStyles,
            {
                fontSize: fonts.medium.fontSize,
                color: palette.white,
                backgroundColor: palette.themePrimary,
                marginRight: spacingAroundItemButton * 2 + 'px',
                selectors: {
                    '&:hover': {
                        backgroundColor: palette.themeDark,
                    },
                    '&:focus': {
                        backgroundColor: palette.themeDark,
                    },
                    '&:active': {
                        backgroundColor: palette.themeDarker,
                    },
                    '&:disabled': {
                        backgroundColor: palette.neutralTertiaryAlt,
                    },
                },
            },
        ],
        descriptiveOverflowButton: [
            classNames.descriptiveOverflowButton,
            getFocusStyle(theme, { inset: -1 }),
            ItemButtonStyles,
            {
                fontSize: fonts.small.fontSize,
                color: palette.neutralSecondary,
                backgroundColor: palette.neutralLighter,
                marginLeft: spacingAroundItemButton * 2 + "px",
            },
        ],
        itemButton: [classNames.itemButton, ItemButtonStyles],
        itemContainer: [
            classNames.itemContainer,
            {
                display: 'flex',
            },
        ],
        members: [
            classNames.members,
            {
                display: 'flex',
                overflow: 'hidden',
                listStyleType: 'none',
                padding: 0,
                margin: "-" + spacingAroundItemButton + "px",
            },
        ],
        member: [
            classNames.member,
            {
                display: 'inline-flex',
                flex: '0 0 auto',
                margin: spacingAroundItemButton + "px",
            },
        ],
        overflowButton: [
            classNames.overflowButton,
            getFocusStyle(theme, { inset: -1 }),
            ItemButtonStyles,
            {
                fontSize: fonts.medium.fontSize,
                color: palette.neutralSecondary,
                backgroundColor: palette.neutralLighter,
                marginLeft: spacingAroundItemButton * 2 + "px",
            },
        ],
        overflowInitialsIcon: [
            {
                color: palette.neutralPrimary,
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        color: 'WindowText',
                    },
                    _a),
            },
        ],
        screenReaderOnly: hiddenContentStyle,
    };
};
//# sourceMappingURL=Facepile.styles.js.map