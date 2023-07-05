import { getGlobalClassNames } from '../../Styling';
var GlobalClassNames = {
    focusedContainer: 'ms-swatchColorPickerBodyContainer',
};
export var getStyles = function (props) {
    var className = props.className, theme = props.theme, cellMargin = props.cellMargin;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: {
            margin: '8px 0',
            borderCollapse: 'collapse',
        },
        tableCell: {
            padding: cellMargin / 2,
        },
        focusedContainer: [
            classNames.focusedContainer,
            {
                clear: 'both',
                display: 'block',
                minWidth: '180px',
            },
            className,
        ],
    };
};
//# sourceMappingURL=SwatchColorPicker.styles.js.map