import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-GroupShowAll',
    link: 'ms-Link',
};
export var getStyles = function (props) {
    var _a;
    var theme = props.theme;
    var fonts = theme.fonts;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                position: 'relative',
                padding: '10px 84px',
                cursor: 'pointer',
                selectors: (_a = {},
                    _a["." + classNames.link] = {
                        fontSize: fonts.small.fontSize,
                    },
                    _a),
            },
        ],
    };
};
//# sourceMappingURL=GroupShowAll.styles.js.map