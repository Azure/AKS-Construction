import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-DocumentCardLogo',
};
export var getStyles = function (props) {
    var theme = props.theme, className = props.className;
    var palette = theme.palette, fonts = theme.fonts;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                // eslint-disable-next-line deprecation/deprecation
                fontSize: fonts.xxLargePlus.fontSize,
                color: palette.themePrimary,
                display: 'block',
                padding: '16px 16px 0 16px',
            },
            className,
        ],
    };
};
//# sourceMappingURL=DocumentCardLogo.styles.js.map