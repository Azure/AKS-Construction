define(["require", "exports", "../MergeStyles"], function (require, exports, MergeStyles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildClassMap = void 0;
    /**
     * Builds a class names object from a given map.
     *
     * @param styles - Map of unprocessed styles.
     * @returns Map of property name to class name.
     */
    function buildClassMap(styles) {
        var classes = {};
        var _loop_1 = function (styleName) {
            if (styles.hasOwnProperty(styleName)) {
                var className_1;
                Object.defineProperty(classes, styleName, {
                    get: function () {
                        if (className_1 === undefined) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            className_1 = MergeStyles_1.mergeStyles(styles[styleName]).toString();
                        }
                        return className_1;
                    },
                    enumerable: true,
                    configurable: true,
                });
            }
        };
        for (var styleName in styles) {
            _loop_1(styleName);
        }
        return classes;
    }
    exports.buildClassMap = buildClassMap;
});
//# sourceMappingURL=buildClassMap.js.map