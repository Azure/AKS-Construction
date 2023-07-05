define(["require", "exports", "./dom/getWindow"], function (require, exports, getWindow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isIE11 = void 0;
    var isIE11 = function () {
        var _a;
        var win = getWindow_1.getWindow();
        if (!((_a = win === null || win === void 0 ? void 0 : win.navigator) === null || _a === void 0 ? void 0 : _a.userAgent)) {
            return false;
        }
        return win.navigator.userAgent.indexOf('rv:11.0') > -1;
    };
    exports.isIE11 = isIE11;
});
//# sourceMappingURL=ie11Detector.js.map