export var TextStyles = function (props, theme) {
    var as = props.as, className = props.className, block = props.block, nowrap = props.nowrap, variant = props.variant;
    var fonts = theme.fonts, semanticColors = theme.semanticColors;
    var variantObject = fonts[variant || 'medium'];
    return {
        root: [
            variantObject,
            {
                color: variantObject.color || semanticColors.bodyText,
                display: block ? (as === 'td' ? 'table-cell' : 'block') : 'inline',
                mozOsxFontSmoothing: variantObject.MozOsxFontSmoothing,
                webkitFontSmoothing: variantObject.WebkitFontSmoothing,
            },
            nowrap && {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            className,
        ],
    };
};
//# sourceMappingURL=Text.styles.js.map