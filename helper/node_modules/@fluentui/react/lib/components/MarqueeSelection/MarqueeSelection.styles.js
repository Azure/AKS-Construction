import { HighContrastSelector } from '../../Styling';
export var getStyles = function (props) {
    var _a, _b, _c;
    var theme = props.theme, className = props.className;
    var palette = theme.palette;
    return {
        root: [
            className,
            {
                position: 'relative',
                cursor: 'default',
            },
        ],
        dragMask: [
            {
                position: 'absolute',
                background: 'rgba(255, 0, 0, 0)',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        background: 'none',
                        backgroundColor: 'transparent',
                    },
                    _a),
            },
        ],
        box: [
            {
                position: 'absolute',
                boxSizing: 'border-box',
                border: "1px solid " + palette.themePrimary,
                pointerEvents: 'none',
                zIndex: 10,
                selectors: (_b = {},
                    _b[HighContrastSelector] = {
                        borderColor: 'Highlight',
                    },
                    _b),
            },
        ],
        boxFill: [
            {
                position: 'absolute',
                boxSizing: 'border-box',
                backgroundColor: palette.themePrimary,
                opacity: 0.1,
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                selectors: (_c = {},
                    _c[HighContrastSelector] = {
                        background: 'none',
                        backgroundColor: 'transparent',
                    },
                    _c),
            },
        ],
    };
};
//# sourceMappingURL=MarqueeSelection.styles.js.map