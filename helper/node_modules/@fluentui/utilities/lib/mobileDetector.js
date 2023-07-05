/**
 * Returns true if and only if the user is on a iOS device.
 * Used to determine whether iOS-specific behavior should be applied.
 */
export var isIOS = function () {
    if (!window || !window.navigator || !window.navigator.userAgent) {
        return false;
    }
    return /iPad|iPhone|iPod/i.test(window.navigator.userAgent);
};
//# sourceMappingURL=mobileDetector.js.map