import { keyframes, PulsingBeaconAnimationStyles, HighContrastSelector } from '../../Styling';
import { getRTL, IsFocusVisibleClassName, memoizeFunction } from '../../Utilities';
export var COACHMARK_WIDTH = 32;
export var COACHMARK_HEIGHT = 32;
export var translateOne = memoizeFunction(function () {
    return keyframes({
        '0%': {
            transform: 'translate(0, 0)',
            animationTimingFunction: 'linear',
        },
        '78.57%': {
            transform: 'translate(0, 0)',
            animationTimingFunction: 'cubic-bezier(0.62, 0, 0.56, 1)',
        },
        '82.14%': {
            transform: 'translate(0, -5px)',
            animationTimingFunction: 'cubic-bezier(0.58, 0, 0, 1)',
        },
        '84.88%': {
            transform: 'translate(0, 9px)',
            animationTimingFunction: 'cubic-bezier(1, 0, 0.56, 1)',
        },
        '88.1%': {
            transform: 'translate(0, -2px)',
            animationTimingFunction: 'cubic-bezier(0.58, 0, 0.67, 1)',
        },
        '90.12%': {
            transform: 'translate(0, 0)',
            animationTimingFunction: 'linear',
        },
        '100%': {
            transform: 'translate(0, 0)',
        },
    });
});
export var scaleOne = memoizeFunction(function () {
    return keyframes({
        '0%': {
            transform: ' scale(0)',
            animationTimingFunction: 'linear',
        },
        '14.29%': {
            transform: 'scale(0)',
            animationTimingFunction: 'cubic-bezier(0.84, 0, 0.52, 0.99)',
        },
        '16.67%': {
            transform: 'scale(1.15)',
            animationTimingFunction: 'cubic-bezier(0.48, -0.01, 0.52, 1.01)',
        },
        '19.05%': {
            transform: 'scale(0.95)',
            animationTimingFunction: 'cubic-bezier(0.48, 0.02, 0.52, 0.98)',
        },
        '21.43%': {
            transform: 'scale(1)',
            animationTimingFunction: 'linear',
        },
        '42.86%': {
            transform: 'scale(1)',
            animationTimingFunction: 'cubic-bezier(0.48, -0.02, 0.52, 1.02)',
        },
        '45.71%': {
            transform: 'scale(0.8)',
            animationTimingFunction: 'cubic-bezier(0.48, 0.01, 0.52, 0.99)',
        },
        '50%': {
            transform: 'scale(1)',
            animationTimingFunction: 'linear',
        },
        '90.12%': {
            transform: 'scale(1)',
            animationTimingFunction: 'cubic-bezier(0.48, -0.02, 0.52, 1.02)',
        },
        '92.98%': {
            transform: 'scale(0.8)',
            animationTimingFunction: 'cubic-bezier(0.48, 0.01, 0.52, 0.99)',
        },
        '97.26%': {
            transform: 'scale(1)',
            animationTimingFunction: 'linear',
        },
        '100%': {
            transform: 'scale(1)',
        },
    });
});
export var rotateOne = memoizeFunction(function () {
    return keyframes({
        '0%': {
            transform: 'rotate(0deg)',
            animationTimingFunction: 'linear',
        },
        '83.33%': {
            transform: ' rotate(0deg)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
        },
        '83.93%': {
            transform: 'rotate(15deg)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
        },
        '84.52%': {
            transform: 'rotate(-15deg)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
        },
        '85.12%': {
            transform: 'rotate(15deg)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
        },
        '85.71%': {
            transform: 'rotate(-15deg)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
        },
        '86.31%': {
            transform: 'rotate(0deg)',
            animationTimingFunction: 'linear',
        },
        '100%': {
            transform: 'rotate(0deg)',
        },
    });
});
export function getStyles(props) {
    var _a;
    var theme = props.theme, className = props.className, color = props.color, beaconColorOne = props.beaconColorOne, beaconColorTwo = props.beaconColorTwo, delayBeforeCoachmarkAnimation = props.delayBeforeCoachmarkAnimation, isCollapsed = props.isCollapsed, isMeasuring = props.isMeasuring, entityHostHeight = props.entityHostHeight, entityHostWidth = props.entityHostWidth, transformOrigin = props.transformOrigin;
    if (!theme) {
        throw new Error('theme is undefined or null in base Dropdown getStyles function.');
    }
    var animationInnerDimension = '35px';
    var animationOuterDimension = '150px';
    var animationBorderWidth = '10px';
    var ContinuousPulse = PulsingBeaconAnimationStyles.continuousPulseAnimationDouble(beaconColorOne ? beaconColorOne : theme.palette.themePrimary, beaconColorTwo ? beaconColorTwo : theme.palette.themeTertiary, animationInnerDimension, animationOuterDimension, animationBorderWidth);
    var ContinuousPulseAnimation = PulsingBeaconAnimationStyles.createDefaultAnimation(ContinuousPulse, delayBeforeCoachmarkAnimation);
    return {
        root: [
            theme.fonts.medium,
            {
                position: 'relative',
            },
            className,
        ],
        pulsingBeacon: [
            {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: getRTL(theme) ? 'translate(50%, -50%)' : 'translate(-50%, -50%)',
                width: '0px',
                height: '0px',
                borderRadius: '225px',
                borderStyle: 'solid',
                opacity: '0',
            },
            isCollapsed && ContinuousPulseAnimation,
        ],
        // Translate Animation Layer
        translateAnimationContainer: [
            {
                width: '100%',
                height: '100%',
            },
            isCollapsed && {
                animationDuration: '14s',
                animationTimingFunction: 'linear',
                animationDirection: 'normal',
                animationIterationCount: '1',
                animationDelay: '0s',
                animationFillMode: 'forwards',
                animationName: translateOne(),
                transition: 'opacity 0.5s ease-in-out',
            },
            !isCollapsed && {
                opacity: '1',
            },
        ],
        // Scale Animation Layer
        scaleAnimationLayer: [
            {
                width: '100%',
                height: '100%',
            },
            isCollapsed && {
                animationDuration: '14s',
                animationTimingFunction: 'linear',
                animationDirection: 'normal',
                animationIterationCount: '1',
                animationDelay: '0s',
                animationFillMode: 'forwards',
                animationName: scaleOne(),
            },
        ],
        // Rotate Animation Layer
        rotateAnimationLayer: [
            {
                width: '100%',
                height: '100%',
            },
            isCollapsed && {
                animationDuration: '14s',
                animationTimingFunction: 'linear',
                animationDirection: 'normal',
                animationIterationCount: '1',
                animationDelay: '0s',
                animationFillMode: 'forwards',
                animationName: rotateOne(),
            },
            !isCollapsed && {
                opacity: '1',
            },
        ],
        // Layer Host, defaults to collapsed
        entityHost: [
            {
                position: 'relative',
                outline: 'none',
                overflow: 'hidden',
                backgroundColor: color,
                borderRadius: COACHMARK_WIDTH,
                transition: 'border-radius 250ms, width 500ms, height 500ms cubic-bezier(0.5, 0, 0, 1)',
                visibility: 'hidden',
                selectors: (_a = {},
                    _a[HighContrastSelector] = {
                        backgroundColor: 'Window',
                        border: '2px solid WindowText',
                    },
                    _a["." + IsFocusVisibleClassName + " &:focus"] = {
                        outline: "1px solid " + theme.palette.themeTertiary,
                    },
                    _a),
            },
            !isMeasuring &&
                isCollapsed && {
                width: COACHMARK_WIDTH,
                height: COACHMARK_HEIGHT,
            },
            !isMeasuring && {
                visibility: 'visible',
            },
            !isCollapsed && {
                borderRadius: '1px',
                opacity: '1',
                width: entityHostWidth,
                height: entityHostHeight,
            },
        ],
        entityInnerHost: [
            {
                transition: 'transform 500ms cubic-bezier(0.5, 0, 0, 1)',
                transformOrigin: transformOrigin,
                transform: 'scale(0)',
            },
            !isCollapsed && {
                width: entityHostWidth,
                height: entityHostHeight,
                transform: 'scale(1)',
            },
            !isMeasuring && {
                visibility: 'visible',
            },
        ],
        childrenContainer: [
            {
                display: !isMeasuring && isCollapsed ? 'none' : 'block',
            },
        ],
        ariaContainer: {
            position: 'fixed',
            opacity: 0,
            height: 0,
            width: 0,
            pointerEvents: 'none',
        },
    };
}
//# sourceMappingURL=Coachmark.styles.js.map