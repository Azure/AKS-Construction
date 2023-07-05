define(["require", "exports", "../memoize"], function (require, exports, memoize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.composeRenderFunction = void 0;
    function createComposedRenderFunction(outer) {
        var outerMemoizer = memoize_1.createMemoizer(function (inner) {
            var innerMemoizer = memoize_1.createMemoizer(function (defaultRender) {
                return function (innerProps) {
                    return inner(innerProps, defaultRender);
                };
            });
            return function (outerProps, defaultRender) {
                return outer(outerProps, defaultRender ? innerMemoizer(defaultRender) : inner);
            };
        });
        return outerMemoizer;
    }
    var memoizer = memoize_1.createMemoizer(createComposedRenderFunction);
    /**
     * Composes two 'render functions' to produce a final render function that renders
     * the outer function, passing the inner function as 'default render'. The inner function
     * is then passed the original 'default render' prop.
     * @public
     */
    function composeRenderFunction(outer, inner) {
        return memoizer(outer)(inner);
    }
    exports.composeRenderFunction = composeRenderFunction;
});
//# sourceMappingURL=composeRenderFunction.js.map