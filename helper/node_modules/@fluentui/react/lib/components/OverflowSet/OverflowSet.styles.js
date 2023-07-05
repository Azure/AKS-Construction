var overflowItemStyle = {
    flexShrink: 0,
    display: 'inherit',
};
export var getStyles = function (props) {
    var className = props.className, vertical = props.vertical;
    return {
        root: [
            'ms-OverflowSet',
            {
                position: 'relative',
                display: 'flex',
                flexWrap: 'nowrap',
            },
            vertical && { flexDirection: 'column' },
            className,
        ],
        item: ['ms-OverflowSet-item', overflowItemStyle],
        overflowButton: ['ms-OverflowSet-overflowButton', overflowItemStyle],
    };
};
//# sourceMappingURL=OverflowSet.styles.js.map