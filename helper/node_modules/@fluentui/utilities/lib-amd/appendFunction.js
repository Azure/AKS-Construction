/* eslint-disable @typescript-eslint/no-explicit-any */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.appendFunction = void 0;
    /**
     * Returns a single function which will call each of the given functions in the context of the
     * parent.
     */
    function appendFunction(parent) {
        var functions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            functions[_i - 1] = arguments[_i];
        }
        if (functions.length < 2) {
            return functions[0];
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            functions.forEach(function (f) { return f && f.apply(parent, args); });
        };
    }
    exports.appendFunction = appendFunction;
});
//# sourceMappingURL=appendFunction.js.map