import { getGlobalClassNames } from '../../../Styling';
var GlobalClassNames = {
    root: 'ms-ShimmerElementsGroup-root',
};
export function getStyles(props) {
    var flexWrap = props.flexWrap, theme = props.theme;
    var classNames = getGlobalClassNames(GlobalClassNames, theme);
    return {
        root: [
            classNames.root,
            theme.fonts.medium,
            {
                display: 'flex',
                alignItems: 'center',
                flexWrap: flexWrap ? 'wrap' : 'nowrap',
                position: 'relative',
            },
        ],
    };
}
//# sourceMappingURL=ShimmerElementsGroup.styles.js.map