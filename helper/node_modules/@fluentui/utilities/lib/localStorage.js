import { getWindow } from './dom/getWindow';
/**
 * Fetches an item from local storage without throwing an exception
 * @param key The key of the item to fetch from local storage
 */
export function getItem(key) {
    var result = null;
    try {
        var win = getWindow();
        result = win ? win.localStorage.getItem(key) : null;
    }
    catch (e) {
        /* Eat the exception */
    }
    return result;
}
/**
 * Inserts an item into local storage without throwing an exception
 * @param key The key of the item to add to local storage
 * @param data The data to put into local storage
 */
export function setItem(key, data) {
    try {
        var win = getWindow();
        win && win.localStorage.setItem(key, data);
    }
    catch (e) {
        /* Eat the exception */
    }
}
//# sourceMappingURL=localStorage.js.map