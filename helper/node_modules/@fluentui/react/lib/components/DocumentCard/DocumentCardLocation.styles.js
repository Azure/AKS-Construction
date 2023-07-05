import { getGlobalClassNames, FontWeights } from '../../Styling';
export var DocumentCardLocationGlobalClassNames = {
    root: 'ms-DocumentCardLocation',
};
export var getStyles = function (props) {
    var theme = props.theme, className = props.className;
    var palette = theme.palette, fonts = theme.fonts;
    var classNames = getGlobalClassNames(DocumentCardLocationGlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            fonts.small,
            {
                color: palette.themePrimary,
                display: 'block',
                fontWeight: FontWeights.semibold,
                overflow: 'hidden',
                padding: '8px 16px',
                position: 'relative',
                textDecoration: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                selectors: {
                    ':hover': {
                        color: palette.themePrimary,
                        cursor: 'pointer',
                    },
                },
            },
            className,
        ],
    };
};
//# sourceMappingURL=DocumentCardLocation.styles.js.map