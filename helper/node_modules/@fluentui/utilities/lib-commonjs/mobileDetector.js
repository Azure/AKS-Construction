"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIOS = void 0;
/**
 * Returns true if and only if the user is on a iOS device.
 * Used to determine whether iOS-specific behavior should be applied.
 */
var isIOS = function () {
    if (!window || !window.navigator || !window.navigator.userAgent) {
        return false;
    }
    return /iPad|iPhone|iPod/i.test(window.navigator.userAgent);
};
exports.isIOS = isIOS;
//# sourceMappingURL=mobileDetector.js.map