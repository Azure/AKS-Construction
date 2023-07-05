import { getGlobalClassNames, getTheme } from '../../../../Styling';
var GlobalClassNames = {
    root: 'ms-EditingItem',
    input: 'ms-EditingItem-input',
};
export var getStyles = function (prop) {
    var theme = getTheme();
    if (!theme) {
        throw new Error('theme is undefined or null in Editing item getStyles function.');
    }
    var semanticColors = theme.semanticColors;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            {
                margin: '4px',
            },
        ],
        input: [
            classNames.input,
            {
                border: '0px',
                outline: 'none',
                width: '100%',
                backgroundColor: semanticColors.inputBackground,
                color: semanticColors.inputText,
                selectors: {
                    '::-ms-clear': {
                        display: 'none',
                    },
                },
            },
        ],
    };
};
//# sourceMappingURL=EditingItem.styles.js.map