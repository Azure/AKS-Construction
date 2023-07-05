import { getWindow } from '@fluentui/utilities';
/**
 * Wrapper for ResizeObserver, with fallback for browsers that don't support ResizeObserver.
 *
 * Calls the onResize callback once layout is complete, and again whenever any of the target(s) change size.
 * Or if ResizeObserver isn't supported, calls the callback whenever the window changes size.
 *
 * @param target - Either a single element, or array of elements to watch for size changes.
 * @param onResize - Callback to be notified when layout is complete, and when the target(s) change size.
 *    If this browser supports ResizeObserver, the callback will be passed the ResizeObserverEntry[] array.
 *    Otherwise, the entries array will be undefined, and you'll need to find another way to get the element's size,
 *    (e.g. clientWidth/clientHeight or getBoundingClientRect).
 *
 * @returns A function to clean up the observer/listener.
 */
export var observeResize = function (target, onResize) {
    if (typeof ResizeObserver !== 'undefined') {
        var observer_1 = new ResizeObserver(onResize);
        if (Array.isArray(target)) {
            target.forEach(function (t) { return observer_1.observe(t); });
        }
        else {
            observer_1.observe(target);
        }
        return function () { return observer_1.disconnect(); };
    }
    else {
        // Fallback for browsers that don't support ResizeObserver
        var onResizeWrapper_1 = function () { return onResize(undefined); };
        var win_1 = getWindow(Array.isArray(target) ? target[0] : target);
        if (!win_1) {
            // Can't listen for resize if we can't get the window object
            return function () {
                // Nothing to clean up
            };
        }
        // Listen for the first animation frame, which will happen after layout is complete
        var animationFrameId_1 = win_1.requestAnimationFrame(onResizeWrapper_1);
        win_1.addEventListener('resize', onResizeWrapper_1, false);
        return function () {
            win_1.cancelAnimationFrame(animationFrameId_1);
            win_1.removeEventListener('resize', onResizeWrapper_1, false);
        };
    }
};
//# sourceMappingURL=observeResize.js.map