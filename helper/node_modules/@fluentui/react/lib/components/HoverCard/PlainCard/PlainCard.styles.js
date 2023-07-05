import { getGlobalClassNames, HighContrastSelector } from '../../../Styling';
var GlobalClassNames = {
    root: 'ms-PlainCard-root',
};
export function getStyles(props) {
    var _a;
    var theme = props.theme, className = props.className;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                pointerEvents: 'auto',
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        border: '1px solid WindowText',
                    },
                    _a),
            },
            className,
        ],
    };
}
//# sourceMappingURL=PlainCard.styles.js.map