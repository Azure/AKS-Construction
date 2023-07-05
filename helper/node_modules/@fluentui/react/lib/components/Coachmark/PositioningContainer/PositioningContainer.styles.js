import { memoizeFunction } from '../../../Utilities';
import { mergeStyleSets, focusClear, HighContrastSelector } from '../../../Styling';
export var getClassNames = memoizeFunction(function () {
    var _a;
    return mergeStyleSets({
        root: [
            {
                position: 'absolute',
                boxSizing: 'border-box',
                border: '1px solid ${}',
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        border: '1px solid WindowText',
                    },
                    _a),
            },
            focusClear(),
        ],
        container: {
            position: 'relative',
        },
        main: {
            backgroundColor: '#ffffff',
            overflowX: 'hidden',
            overflowY: 'hidden',
            position: 'relative',
        },
        overFlowYHidden: {
            overflowY: 'hidden',
        },
    });
});
//# sourceMappingURL=PositioningContainer.styles.js.map