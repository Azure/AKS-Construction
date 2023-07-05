import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-TooltipHost',
    ariaPlaceholder: 'ms-TooltipHost-aria-placeholder',
};
export var getStyles = function (props) {
    var className = props.className, theme = props.theme;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                display: 'inline',
            },
            className,
        ],
    };
};
//# sourceMappingURL=TooltipHost.styles.js.map