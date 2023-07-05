"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.css = void 0;
/**
 * Concatination helper, which can merge class names together. Skips over falsey values.
 *
 * @public
 */
function css() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var classes = [];
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
        if (arg) {
            if (typeof arg === 'string') {
                classes.push(arg);
            }
            else if (arg.hasOwnProperty('toString') && typeof arg.toString === 'function') {
                classes.push(arg.toString());
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                for (var key in arg) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (arg[key]) {
                        classes.push(key);
                    }
                }
            }
        }
    }
    return classes.join(' ');
}
exports.css = css;
//# sourceMappingURL=css.js.map