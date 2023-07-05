import { getGlobalClassNames, HighContrastSelector } from '../../../Styling';
var GlobalClassNames = {
    root: 'ms-ShimmerLine-root',
    topLeftCorner: 'ms-ShimmerLine-topLeftCorner',
    topRightCorner: 'ms-ShimmerLine-topRightCorner',
    bottomLeftCorner: 'ms-ShimmerLine-bottomLeftCorner',
    bottomRightCorner: 'ms-ShimmerLine-bottomRightCorner',
};
export function getStyles(props) {
    var _a;
    // eslint-disable-next-line deprecation/deprecation
    var height = props.height, borderStyle = props.borderStyle, theme = props.theme;
    var semanticColors = theme.semanticColors;
    var globalClassNames = getGlobalClassNames(GlobalClassNames, theme);
    var borderStyles = borderStyle || {};
    var sharedCornerStyles = {
        position: 'absolute',
        fill: semanticColors.bodyBackground,
    };
    return {
        root: [
            globalClassNames.root,
            theme.fonts.medium,
            {
                height: height + "px",
                boxSizing: 'content-box',
                position: 'relative',
                borderTopStyle: 'solid',
                borderBottomStyle: 'solid',
                borderColor: semanticColors.bodyBackground,
                borderWidth: 0,
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        borderColor: 'Window',
                        selectors: {
                            '> *': {
                                fill: 'Window',
                            },
                        },
                    },
                    _a),
            },
            borderStyles,
        ],
        topLeftCorner: [
            globalClassNames.topLeftCorner,
            {
                top: '0',
                left: '0',
            },
            sharedCornerStyles,
        ],
        topRightCorner: [
            globalClassNames.topRightCorner,
            {
                top: '0',
                right: '0',
            },
            sharedCornerStyles,
        ],
        bottomRightCorner: [
            globalClassNames.bottomRightCorner,
            {
                bottom: '0',
                right: '0',
            },
            sharedCornerStyles,
        ],
        bottomLeftCorner: [
            globalClassNames.bottomLeftCorner,
            {
                bottom: '0',
                left: '0',
            },
            sharedCornerStyles,
        ],
    };
}
//# sourceMappingURL=ShimmerLine.styles.js.map