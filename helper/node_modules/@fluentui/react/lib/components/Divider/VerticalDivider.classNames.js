import { memoizeFunction } from '../../Utilities';
import { mergeStyleSets } from '../../Styling';
/**
 * @deprecated use getStyles exported from VerticalDivider.styles.ts
 */
export var getDividerClassNames = memoizeFunction(
// eslint-disable-next-line deprecation/deprecation
function (theme) {
    return mergeStyleSets({
        wrapper: {
            display: 'inline-flex',
            height: '100%',
            alignItems: 'center',
        },
        divider: {
            width: 1,
            height: '100%',
            backgroundColor: theme.palette.neutralTertiaryAlt,
        },
    });
});
//# sourceMappingURL=VerticalDivider.classNames.js.map