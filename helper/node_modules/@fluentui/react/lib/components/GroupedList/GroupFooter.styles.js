import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-groupFooter',
};
export var getStyles = function (props) {
    var theme = props.theme, className = props.className;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            theme.fonts.medium,
            classNames.root,
            {
                position: 'relative',
                padding: '5px 38px',
            },
            className,
        ],
    };
};
//# sourceMappingURL=GroupFooter.styles.js.map