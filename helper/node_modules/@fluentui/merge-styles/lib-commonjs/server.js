"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderStatic = void 0;
var Stylesheet_1 = require("./Stylesheet");
/**
 * Renders a given string and returns both html and css needed for the html.
 * @param onRender - Function that returns a string.
 * @param namespace - Optional namespace to prepend to css classnames to avoid collisions.
 */
function renderStatic(onRender, namespace) {
    var stylesheet = Stylesheet_1.Stylesheet.getInstance();
    stylesheet.setConfig({
        injectionMode: Stylesheet_1.InjectionMode.none,
        namespace: namespace,
    });
    stylesheet.reset();
    return {
        html: onRender(),
        css: stylesheet.getRules(true),
    };
}
exports.renderStatic = renderStatic;
//# sourceMappingURL=server.js.map