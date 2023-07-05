define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRect = void 0;
    /**
     * Helper to get bounding client rect. Passing in window will get the window size.
     *
     * @public
     */
    function getRect(element) {
        var rect;
        if (element) {
            if (element === window) {
                rect = {
                    left: 0,
                    top: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                };
            }
            else if (element.getBoundingClientRect) {
                rect = element.getBoundingClientRect();
            }
        }
        return rect;
    }
    exports.getRect = getRect;
});
//# sourceMappingURL=getRect.js.map