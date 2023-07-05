import { mergeStyleSets } from '../../Styling';
/** Class names used in themeable and non-themeable Icon components */
export var classNames = mergeStyleSets({
    root: {
        display: 'inline-block',
    },
    placeholder: [
        'ms-Icon-placeHolder',
        {
            width: '1em',
        },
    ],
    image: [
        'ms-Icon-imageContainer',
        {
            overflow: 'hidden',
        },
    ],
});
/** Class name used only in non-themeable Icon components */
export var MS_ICON = 'ms-Icon';
export var getStyles = function (props) {
    var className = props.className, iconClassName = props.iconClassName, isPlaceholder = props.isPlaceholder, isImage = props.isImage, styles = props.styles;
    return {
        root: [
            isPlaceholder && classNames.placeholder,
            classNames.root,
            isImage && classNames.image,
            iconClassName,
            className,
            styles && styles.root,
            // eslint-disable-next-line deprecation/deprecation
            styles && styles.imageContainer,
        ],
    };
};
//# sourceMappingURL=Icon.styles.js.map