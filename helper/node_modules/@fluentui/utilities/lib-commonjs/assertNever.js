"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNever = void 0;
/**
 * AssertNever is a utility function that can be used for exhaustiveness checks in switch statements.
 *
 * @public
 */
function assertNever(x) {
    throw new Error('Unexpected object: ' + x);
}
exports.assertNever = assertNever;
//# sourceMappingURL=assertNever.js.map