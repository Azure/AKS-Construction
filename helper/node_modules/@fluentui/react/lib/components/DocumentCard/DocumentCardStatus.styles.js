import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-DocumentCardStatus',
};
export var getStyles = function (props) {
    var className = props.className, theme = props.theme;
    var palette = theme.palette, fonts = theme.fonts;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            fonts.medium,
            {
                margin: '8px 16px',
                color: palette.neutralPrimary,
                backgroundColor: palette.neutralLighter,
                height: '32px',
            },
            className,
        ],
    };
};
//# sourceMappingURL=DocumentCardStatus.styles.js.map