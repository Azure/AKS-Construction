define(["require", "exports", "@fluentui/merge-styles"], function (require, exports, merge_styles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MotionAnimations = exports.MotionTimings = exports.MotionDurations = void 0;
    var fadeInAnimationName = merge_styles_1.keyframes({
        from: { opacity: 0 },
        to: { opacity: 1 },
    });
    var fadeOutAnimationName = merge_styles_1.keyframes({
        from: { opacity: 1 },
        to: { opacity: 0 },
    });
    var scaleDownInAnimationName = merge_styles_1.keyframes({
        from: { transform: 'scale3d(1.15, 1.15, 1)' },
        to: { transform: 'scale3d(1, 1, 1)' },
    });
    var scaleDownOutAnimationName = merge_styles_1.keyframes({
        from: { transform: 'scale3d(1, 1, 1)' },
        to: { transform: 'scale3d(0.9, 0.9, 1)' },
    });
    var slideLeftOutAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(0, 0, 0)' },
        to: { transform: 'translate3d(-48px, 0, 0)' },
    });
    var slideRightOutAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(0, 0, 0)' },
        to: { transform: 'translate3d(48px, 0, 0)' },
    });
    var slideLeftInAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(48px, 0, 0)' },
        to: { transform: 'translate3d(0, 0, 0)' },
    });
    var slideRightInAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(-48px, 0, 0)' },
        to: { transform: 'translate3d(0, 0, 0)' },
    });
    var slideUpOutAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(0, 0, 0)' },
        to: { transform: 'translate3d(0, -48px, 0)' },
    });
    var slideDownOutAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(0, 0, 0)' },
        to: { transform: 'translate3d(0, 48px, 0)' },
    });
    var slideUpInAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(0, 48px, 0)' },
        to: { transform: 'translate3d(0, 0, 0)' },
    });
    var slideDownInAnimationName = merge_styles_1.keyframes({
        from: { transform: 'translate3d(0, -48px, 0)' },
        to: { transform: 'translate3d(0, 0, 0)' },
    });
    var MotionDurations;
    (function (MotionDurations) {
        MotionDurations.duration1 = '100ms';
        MotionDurations.duration2 = '200ms';
        MotionDurations.duration3 = '300ms';
        MotionDurations.duration4 = '400ms';
    })(MotionDurations = exports.MotionDurations || (exports.MotionDurations = {}));
    var MotionTimings;
    (function (MotionTimings) {
        MotionTimings.accelerate = 'cubic-bezier(0.9, 0.1, 1, 0.2)';
        MotionTimings.decelerate = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
        MotionTimings.linear = 'cubic-bezier(0, 0, 1, 1)';
        MotionTimings.standard = 'cubic-bezier(0.8, 0, 0.2, 1)';
    })(MotionTimings = exports.MotionTimings || (exports.MotionTimings = {}));
    function _createAnimation(animationName, animationDuration, animationTimingFunction) {
        return animationName + " " + animationDuration + " " + animationTimingFunction;
    }
    var MotionAnimations;
    (function (MotionAnimations) {
        MotionAnimations.fadeIn = _createAnimation(fadeInAnimationName, MotionDurations.duration1, MotionTimings.linear);
        MotionAnimations.fadeOut = _createAnimation(fadeOutAnimationName, MotionDurations.duration1, MotionTimings.linear);
        MotionAnimations.scaleDownIn = _createAnimation(scaleDownInAnimationName, MotionDurations.duration3, MotionTimings.decelerate);
        MotionAnimations.scaleDownOut = _createAnimation(scaleDownOutAnimationName, MotionDurations.duration3, MotionTimings.decelerate);
        MotionAnimations.slideLeftOut = _createAnimation(slideLeftOutAnimationName, MotionDurations.duration1, MotionTimings.accelerate);
        MotionAnimations.slideRightOut = _createAnimation(slideRightOutAnimationName, MotionDurations.duration1, MotionTimings.accelerate);
        MotionAnimations.slideLeftIn = _createAnimation(slideLeftInAnimationName, MotionDurations.duration1, MotionTimings.decelerate);
        MotionAnimations.slideRightIn = _createAnimation(slideRightInAnimationName, MotionDurations.duration1, MotionTimings.decelerate);
        MotionAnimations.slideUpOut = _createAnimation(slideUpOutAnimationName, MotionDurations.duration1, MotionTimings.accelerate);
        MotionAnimations.slideDownOut = _createAnimation(slideDownOutAnimationName, MotionDurations.duration1, MotionTimings.accelerate);
        MotionAnimations.slideUpIn = _createAnimation(slideUpInAnimationName, MotionDurations.duration1, MotionTimings.decelerate);
        MotionAnimations.slideDownIn = _createAnimation(slideDownInAnimationName, MotionDurations.duration1, MotionTimings.decelerate);
    })(MotionAnimations = exports.MotionAnimations || (exports.MotionAnimations = {}));
});
//# sourceMappingURL=FluentMotion.js.map