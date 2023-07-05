"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDir = void 0;
var getWindow_1 = require("./dom/getWindow");
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
//# sourceMappingURL=initializeDir.js.map