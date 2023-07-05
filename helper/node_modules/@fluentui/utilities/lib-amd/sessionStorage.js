define(["require", "exports", "./dom/getWindow"], function (require, exports, getWindow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setItem = exports.getItem = void 0;
    /**
     * Fetches an item from session storage without throwing an exception
     * @param key The key of the item to fetch from session storage
     */
    function getItem(key) {
        var result = null;
        try {
            var win = getWindow_1.getWindow();
            result = win ? win.sessionStorage.getItem(key) : null;
        }
        catch (e) {
            /* Eat the exception */
        }
        return result;
    }
    exports.getItem = getItem;
    /**
     * Inserts an item into session storage without throwing an exception
     * @param key The key of the item to add to session storage
     * @param data The data to put into session storage
     */
    function setItem(key, data) {
        var _a;
        try {
            (_a = getWindow_1.getWindow()) === null || _a === void 0 ? void 0 : _a.sessionStorage.setItem(key, data);
        }
        catch (e) {
            /* Eat the exception */
        }
    }
    exports.setItem = setItem;
});
//# sourceMappingURL=sessionStorage.js.map