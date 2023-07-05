import { extractStyleParts } from './extractStyleParts';
import { getStyleOptions } from './StyleOptionsState';
import { styleToClassName } from './styleToClassName';
/**
 * Concatenation helper, which can merge class names together. Skips over falsey values.
 *
 * @public
 */
export function mergeStyles() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return mergeCss(args, getStyleOptions());
}
/**
 * Concatenation helper, which can merge class names together. Skips over falsey values.
 * Accepts a set of options that will be used when calculating styles.
 *
 * @public
 */
export function mergeCss(args, options) {
    var styleArgs = args instanceof Array ? args : [args];
    var _a = extractStyleParts(styleArgs), classes = _a.classes, objects = _a.objects;
    if (objects.length) {
        classes.push(styleToClassName(options || {}, objects));
    }
    return classes.join(' ');
}
//# sourceMappingURL=mergeStyles.js.map