import { concatStyleSets, getTheme, HighContrastSelector, keyframes, PulsingBeaconAnimationStyles, } from '../../Styling';
import { memoizeFunction } from '../../Utilities';
var DEFAULT_PERSONA_SIZE = '32px';
var COMPACT_PERSONA_SIZE = '16px';
var DEFAULT_ICON_SIZE = '16px';
var COMPACT_ICON_SIZE = '13px';
var ANIMATION_INNER_DIMENSION = '4px';
var ANIMATION_OUTER_DIMENSION = '28px';
var ANIMATION_BORDER_WIDTH = '4px';
var fadeIn = memoizeFunction(function () {
    return keyframes({
        from: { opacity: 0 },
        to: { opacity: 1 },
    });
});
var slideIn = memoizeFunction(function () {
    return keyframes({
        from: { transform: 'translateX(-10px)' },
        to: { transform: 'translateX(0)' },
    });
});
export var getStyles = memoizeFunction(function (theme, customStyles, animateBeaconSignal, beaconColorOne, beaconColorTwo, isCompact) {
    var _a;
    if (theme === void 0) { theme = getTheme(); }
    var continuousPulse = PulsingBeaconAnimationStyles.continuousPulseAnimationSingle(beaconColorOne ? beaconColorOne : theme.palette.themePrimary, beaconColorTwo ? beaconColorTwo : theme.palette.themeTertiary, ANIMATION_INNER_DIMENSION, ANIMATION_OUTER_DIMENSION, ANIMATION_BORDER_WIDTH);
    var continuousPulseAnimation = {
        animationName: continuousPulse,
        animationIterationCount: '1',
        animationDuration: '.8s',
        zIndex: 1,
    };
    var slideInAnimation = {
        animationName: slideIn(),
        animationIterationCount: '1',
        animationDuration: '.5s',
    };
    var fadeInAnimation = {
        animationName: fadeIn(),
        animationIterationCount: '1',
        animationDuration: '.5s',
    };
    var ActivityItemStyles = {
        root: [
            theme.fonts.small,
            {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                boxSizing: 'border-box',
                color: theme.palette.neutralSecondary,
            },
            isCompact && animateBeaconSignal && fadeInAnimation,
        ],
        pulsingBeacon: [
            {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '0px',
                height: '0px',
                borderRadius: '225px',
                borderStyle: 'solid',
                opacity: 0,
            },
            isCompact && animateBeaconSignal && continuousPulseAnimation,
        ],
        isCompactRoot: {
            alignItems: 'center',
        },
        personaContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            minWidth: DEFAULT_PERSONA_SIZE,
            width: DEFAULT_PERSONA_SIZE,
            height: DEFAULT_PERSONA_SIZE,
        },
        isCompactPersonaContainer: {
            display: 'inline-flex',
            flexWrap: 'nowrap',
            flexBasis: 'auto',
            height: COMPACT_PERSONA_SIZE,
            width: 'auto',
            minWidth: '0',
            paddingRight: '6px',
        },
        activityTypeIcon: {
            height: DEFAULT_PERSONA_SIZE,
            fontSize: DEFAULT_ICON_SIZE,
            lineHeight: DEFAULT_ICON_SIZE,
            marginTop: '3px',
        },
        isCompactIcon: {
            height: COMPACT_PERSONA_SIZE,
            minWidth: COMPACT_PERSONA_SIZE,
            fontSize: COMPACT_ICON_SIZE,
            lineHeight: COMPACT_ICON_SIZE,
            color: theme.palette.themePrimary,
            marginTop: '1px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            selectors: {
                '.ms-Persona-imageArea': {
                    margin: '-2px 0 0 -2px',
                    border: '2px solid' + theme.palette.white,
                    borderRadius: '50%',
                    selectors: (_a = {},
                        _a[HighContrastSelector] = {
                            border: 'none',
                            margin: '0',
                        },
                        _a),
                },
            },
        },
        activityPersona: {
            display: 'block',
        },
        doublePersona: {
            selectors: {
                ':first-child': {
                    alignSelf: 'flex-end',
                },
            },
        },
        isCompactPersona: {
            display: 'inline-block',
            width: '8px',
            minWidth: '8px',
            overflow: 'visible',
        },
        activityContent: [
            {
                padding: '0 8px',
            },
            isCompact && animateBeaconSignal && slideInAnimation,
        ],
        activityText: {
            display: 'inline',
        },
        isCompactContent: {
            flex: '1',
            padding: '0 4px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
        },
        commentText: {
            color: theme.palette.neutralPrimary,
        },
        timeStamp: [
            theme.fonts.tiny,
            {
                fontWeight: 400,
                color: theme.palette.neutralSecondary,
            },
        ],
        isCompactTimeStamp: {
            display: 'inline-block',
            paddingLeft: '0.3em',
            fontSize: '1em',
        },
    };
    return concatStyleSets(ActivityItemStyles, customStyles);
});
//# sourceMappingURL=ActivityItem.styles.js.map