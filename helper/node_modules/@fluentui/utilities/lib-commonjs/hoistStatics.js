"use strict";
/**
 * Allows you to hoist static functions in components.
 * Created for the purpose of fixing broken static functions in classes
 * that utilize decorators.
 *
 * @public
 * @param source - The object where the methods are hoisted from.
 * @param dest - The object to hoist the methods onto.
 * @returns The dest object with methods added
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoistStatics = void 0;
function hoistStatics(source, dest) {
    for (var name_1 in source) {
        if (source.hasOwnProperty(name_1)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dest[name_1] = source[name_1];
        }
    }
    return dest;
}
exports.hoistStatics = hoistStatics;
//# sourceMappingURL=hoistStatics.js.map