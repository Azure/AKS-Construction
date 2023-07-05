import { getGlobalClassNames } from '../../Styling';
var ACTION_SIZE = 34;
var HORIZONTAL_PADDING = 12;
var VERTICAL_PADDING = 4;
var GlobalClassNames = {
    root: 'ms-DocumentCardActions',
    action: 'ms-DocumentCardActions-action',
    views: 'ms-DocumentCardActions-views',
};
export var getStyles = function (props) {
    var className = props.className, theme = props.theme;
    var palette = theme.palette, fonts = theme.fonts;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                height: ACTION_SIZE + "px",
                padding: VERTICAL_PADDING + "px " + HORIZONTAL_PADDING + "px",
                position: 'relative',
            },
            className,
        ],
        action: [
            classNames.action,
            {
                float: 'left',
                marginRight: '4px',
                color: palette.neutralSecondary,
                cursor: 'pointer',
                selectors: {
                    '.ms-Button': {
                        fontSize: fonts.mediumPlus.fontSize,
                        height: ACTION_SIZE,
                        width: ACTION_SIZE,
                    },
                    '.ms-Button:hover .ms-Button-icon': {
                        color: theme.semanticColors.buttonText,
                        cursor: 'pointer',
                    },
                },
            },
        ],
        views: [
            classNames.views,
            {
                textAlign: 'right',
                lineHeight: ACTION_SIZE,
            },
        ],
        viewsIcon: {
            marginRight: '8px',
            fontSize: fonts.medium.fontSize,
            verticalAlign: 'top',
        },
    };
};
//# sourceMappingURL=DocumentCardActions.styles.js.map