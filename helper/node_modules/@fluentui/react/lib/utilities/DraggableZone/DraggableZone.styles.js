import { memoizeFunction } from '../../Utilities';
import { mergeStyles } from '../../Styling';
export var getClassNames = memoizeFunction(function (className, isDragging) {
    return {
        root: mergeStyles(className, isDragging && {
            touchAction: 'none',
            selectors: {
                '& *': {
                    userSelect: 'none',
                },
            },
        }),
    };
});
//# sourceMappingURL=DraggableZone.styles.js.map