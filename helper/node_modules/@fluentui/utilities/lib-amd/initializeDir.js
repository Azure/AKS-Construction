define(["require", "exports", "./dom/getWindow"], function (require, exports, getWindow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initializeDir = void 0;
    function initializeDir(win) {
        var w = (win || getWindow_1.getWindow());
        if (w && !w.__hasInitializedDir__) {
            w.__hasInitializedDir__ = true;
            // Ensure that the documentElement has a 'dir' attribute.
            var documentElement = w.document.documentElement;
            if (!documentElement.hasAttribute('dir')) {
                documentElement.setAttribute('dir', 'ltr');
            }
        }
    }
    exports.initializeDir = initializeDir;
});
//# sourceMappingURL=initializeDir.js.map