import { createMemoizer } from '../memoize';
function createComposedRenderFunction(outer) {
    var outerMemoizer = createMemoizer(function (inner) {
        var innerMemoizer = createMemoizer(function (defaultRender) {
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
var memoizer = createMemoizer(createComposedRenderFunction);
/**
 * Composes two 'render functions' to produce a final render function that renders
 * the outer function, passing the inner function as 'default render'. The inner function
 * is then passed the original 'default render' prop.
 * @public
 */
export function composeRenderFunction(outer, inner) {
    return memoizer(outer)(inner);
}
//# sourceMappingURL=composeRenderFunction.js.map