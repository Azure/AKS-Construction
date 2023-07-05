import { InjectionMode, Stylesheet } from './Stylesheet';
/**
 * Renders a given string and returns both html and css needed for the html.
 * @param onRender - Function that returns a string.
 * @param namespace - Optional namespace to prepend to css classnames to avoid collisions.
 */
export function renderStatic(onRender, namespace) {
    var stylesheet = Stylesheet.getInstance();
    stylesheet.setConfig({
        injectionMode: InjectionMode.none,
        namespace: namespace,
    });
    stylesheet.reset();
    return {
        html: onRender(),
        css: stylesheet.getRules(true),
    };
}
//# sourceMappingURL=server.js.map