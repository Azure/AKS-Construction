import { mergeStyleSets, HighContrastSelector } from '../../Styling';
export var getStyles = function (props) {
    var _a;
    var theme = props.theme, disabled = props.disabled, visible = props.visible;
    return {
        container: [
            {
                backgroundColor: theme.palette.neutralDark,
            },
            disabled && {
                opacity: 0.5,
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        color: 'GrayText',
                        opacity: 1,
                    },
                    _a),
            },
            !visible && {
                visibility: 'hidden',
            },
        ],
        root: [
            theme.fonts.medium,
            {
                textAlign: 'center',
                paddingLeft: '3px',
                paddingRight: '3px',
                backgroundColor: theme.palette.neutralDark,
                color: theme.palette.neutralLight,
                minWidth: '11px',
                lineHeight: '17px',
                height: '17px',
                display: 'inline-block',
            },
            disabled && {
                color: theme.palette.neutralTertiaryAlt,
            },
        ],
    };
};
export var getCalloutStyles = function (props) {
    return {
        container: [],
        root: [
            {
                border: 'none',
                boxShadow: 'none',
            },
        ],
        beak: [],
        beakCurtain: [],
        calloutMain: [
            {
                backgroundColor: 'transparent',
            },
        ],
    };
};
export var getCalloutOffsetStyles = function (offset) {
    return function (props) {
        return mergeStyleSets(getCalloutStyles(props), {
            root: [
                {
                    // eslint-disable-next-line deprecation/deprecation
                    marginLeft: offset.left || offset.x,
                    // eslint-disable-next-line deprecation/deprecation
                    marginTop: offset.top || offset.y,
                },
            ],
        });
    };
};
//# sourceMappingURL=Keytip.styles.js.map