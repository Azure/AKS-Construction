import { __assign } from "tslib";
import * as React from 'react';
import { createMemoizer } from '../memoize';
function createComposedComponent(outer) {
    var Outer = outer;
    var outerMemoizer = createMemoizer(function (inner) {
        if (outer === inner) {
            throw new Error('Attempted to compose a component with itself.');
        }
        var Inner = inner;
        var innerMemoizer = createMemoizer(function (defaultRender) {
            var InnerWithDefaultRender = function (innerProps) {
                return React.createElement(Inner, __assign({}, innerProps, { defaultRender: defaultRender }));
            };
            return InnerWithDefaultRender;
        });
        var OuterWithDefaultRender = function (outerProps) {
            var defaultRender = outerProps.defaultRender;
            return React.createElement(Outer, __assign({}, outerProps, { defaultRender: defaultRender ? innerMemoizer(defaultRender) : Inner }));
        };
        return OuterWithDefaultRender;
    });
    return outerMemoizer;
}
var componentAsMemoizer = createMemoizer(createComposedComponent);
/**
 * Composes two components which conform to the `IComponentAs` specification; that is, two
 * components which accept a `defaultRender` prop, which is a 'default' implementation of
 * a component which accepts the same overall props.
 *
 * @public
 */
export function composeComponentAs(outer, inner) {
    return componentAsMemoizer(outer)(inner);
}
//# sourceMappingURL=composeComponentAs.js.map