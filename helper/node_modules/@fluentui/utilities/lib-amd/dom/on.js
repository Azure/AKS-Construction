define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.on = void 0;
    function on(element, eventName, callback, options) {
        element.addEventListener(eventName, callback, options);
        return function () { return element.removeEventListener(eventName, callback, options); };
    }
    exports.on = on;
});
//# sourceMappingURL=on.js.map