"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeComponentAs = void 0;
var tslib_1 = require("tslib");
var React = require("react");
var memoize_1 = require("../memoize");
function createComposedComponent(outer) {
    var Outer = outer;
    var outerMemoizer = memoize_1.createMemoizer(function (inner) {
        if (outer === inner) {
            throw new Error('Attempted to compose a component with itself.');
        }
        var Inner = inner;
        var innerMemoizer = memoize_1.createMemoizer(function (defaultRender) {
            var InnerWithDefaultRender = function (innerProps) {
                return React.createElement(Inner, tslib_1.__assign({}, innerProps, { defaultRender: defaultRender }));
            };
            return InnerWithDefaultRender;
        });
        var OuterWithDefaultRender = function (outerProps) {
            var defaultRender = outerProps.defaultRender;
            return React.createElement(Outer, tslib_1.__assign({}, outerProps, { defaultRender: defaultRender ? innerMemoizer(defaultRender) : Inner }));
        };
        return OuterWithDefaultRender;
    });
    return outerMemoizer;
}
var componentAsMemoizer = memoize_1.createMemoizer(createComposedComponent);
/**
 * Composes two components which conform to the `IComponentAs` specification; that is, two
 * components which accept a `defaultRender` prop, which is a 'default' implementation of
 * a component which accepts the same overall props.
 *
 * @public
 */
function composeComponentAs(outer, inner) {
    return componentAsMemoizer(outer)(inner);
}
exports.composeComponentAs = composeComponentAs;
//# sourceMappingURL=composeComponentAs.js.map