define(["require", "exports", "./dom/getWindow"], function (require, exports, getWindow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setItem = exports.getItem = void 0;
    /**
     * Fetches an item from local storage without throwing an exception
     * @param key The key of the item to fetch from local storage
     */
    function getItem(key) {
        var result = null;
        try {
            var win = getWindow_1.getWindow();
            result = win ? win.localStorage.getItem(key) : null;
        }
        catch (e) {
            /* Eat the exception */
        }
        return result;
    }
    exports.getItem = getItem;
    /**
     * Inserts an item into local storage without throwing an exception
     * @param key The key of the item to add to local storage
     * @param data The data to put into local storage
     */
    function setItem(key, data) {
        try {
            var win = getWindow_1.getWindow();
            win && win.localStorage.setItem(key, data);
        }
        catch (e) {
            /* Eat the exception */
        }
    }
    exports.setItem = setItem;
});
//# sourceMappingURL=localStorage.js.map