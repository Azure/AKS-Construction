define(["require", "exports", "./extractStyleParts", "./StyleOptionsState", "./styleToClassName"], function (require, exports, extractStyleParts_1, StyleOptionsState_1, styleToClassName_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergeCss = exports.mergeStyles = void 0;
    /**
     * Concatenation helper, which can merge class names together. Skips over falsey values.
     *
     * @public
     */
    function mergeStyles() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return mergeCss(args, StyleOptionsState_1.getStyleOptions());
    }
    exports.mergeStyles = mergeStyles;
    /**
     * Concatenation helper, which can merge class names together. Skips over falsey values.
     * Accepts a set of options that will be used when calculating styles.
     *
     * @public
     */
    function mergeCss(args, options) {
        var styleArgs = args instanceof Array ? args : [args];
        var _a = extractStyleParts_1.extractStyleParts(styleArgs), classes = _a.classes, objects = _a.objects;
        if (objects.length) {
            classes.push(styleToClassName_1.styleToClassName(options || {}, objects));
        }
        return classes.join(' ');
    }
    exports.mergeCss = mergeCss;
});
//# sourceMappingURL=mergeStyles.js.map