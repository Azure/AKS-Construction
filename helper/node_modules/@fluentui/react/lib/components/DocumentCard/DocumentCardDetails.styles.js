import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    root: 'ms-DocumentCardDetails',
};
export var getStyles = function (props) {
    var className = props.className, theme = props.theme;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                overflow: 'hidden',
            },
            className,
        ],
    };
};
//# sourceMappingURL=DocumentCardDetails.styles.js.map