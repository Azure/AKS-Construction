import { HighContrastSelector, getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-Overlay',
    rootDark: 'ms-Overlay--dark',
};
export var getStyles = function (props) {
    var _a;
    var className = props.className, theme = props.theme, isNone = props.isNone, isDark = props.isDark;
    var palette = theme.palette;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            theme.fonts.medium,
            {
                backgroundColor: palette.whiteTranslucent40,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                position: 'absolute',
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        border: '1px solid WindowText',
                        opacity: 0,
                    },
                    _a),
            },
            isNone && {
                visibility: 'hidden',
            },
            isDark && [
                classNames.rootDark,
                {
                    backgroundColor: palette.blackTranslucent40,
                },
            ],
            className,
        ],
    };
};
//# sourceMappingURL=Overlay.styles.js.map