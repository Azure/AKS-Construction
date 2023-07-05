import { concatStyleSets, getFocusStyle } from '../../../Styling';
import { memoizeFunction } from '../../../Utilities';
export var getStyles = memoizeFunction(function (theme, customStyles) {
    return concatStyleSets({
        root: [
            getFocusStyle(theme, {
                inset: 1,
                highContrastStyle: {
                    outlineOffset: '-4px',
                    outline: '1px solid Window',
                },
                borderColor: 'transparent',
            }),
            {
                height: 24,
            },
        ],
    }, customStyles);
});
//# sourceMappingURL=MessageBarButton.styles.js.map