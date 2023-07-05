/**
 * Renders a given string and returns both html and css needed for the html.
 * @param onRender - Function that returns a string.
 * @param namespace - Optional namespace to prepend to css classnames to avoid collisions.
 */
export declare function renderStatic(onRender: () => string, namespace?: string): {
    html: string;
    css: string;
};
