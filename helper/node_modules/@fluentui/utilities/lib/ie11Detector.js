import { getWindow } from './dom/getWindow';
export var isIE11 = function () {
    var _a;
    var win = getWindow();
    if (!((_a = win === null || win === void 0 ? void 0 : win.navigator) === null || _a === void 0 ? void 0 : _a.userAgent)) {
        return false;
    }
    return win.navigator.userAgent.indexOf('rv:11.0') > -1;
};
//# sourceMappingURL=ie11Detector.js.map