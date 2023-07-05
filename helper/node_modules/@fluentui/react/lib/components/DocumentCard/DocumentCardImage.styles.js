var centeredIconSize = '42px';
var cornerIconSize = '32px';
export var getStyles = function (props) {
    var theme = props.theme, className = props.className, height = props.height, width = props.width;
    var palette = theme.palette;
    return {
        root: [
            {
                borderBottom: "1px solid " + palette.neutralLight,
                position: 'relative',
                backgroundColor: palette.neutralLighterAlt,
                overflow: "hidden",
                height: height && height + "px",
                width: width && width + "px",
            },
            className,
        ],
        centeredIcon: [
            {
                height: centeredIconSize,
                width: centeredIconSize,
                fontSize: centeredIconSize,
            },
        ],
        centeredIconWrapper: [
            {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
            },
        ],
        cornerIcon: [
            {
                left: '10px',
                bottom: '10px',
                height: cornerIconSize,
                width: cornerIconSize,
                fontSize: cornerIconSize,
                position: 'absolute',
                overflow: 'visible',
            },
        ],
    };
};
//# sourceMappingURL=DocumentCardImage.styles.js.map