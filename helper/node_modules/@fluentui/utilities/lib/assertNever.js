/**
 * AssertNever is a utility function that can be used for exhaustiveness checks in switch statements.
 *
 * @public
 */
export function assertNever(x) {
    throw new Error('Unexpected object: ' + x);
}
//# sourceMappingURL=assertNever.js.map