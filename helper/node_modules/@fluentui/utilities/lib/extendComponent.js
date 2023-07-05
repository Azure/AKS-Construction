import { appendFunction } from './appendFunction';
/**
 * Extends a component's lifetime methods by appending new functions to the existing lifetime functions.
 */
export function extendComponent(parent, methods) {
    for (var name_1 in methods) {
        if (methods.hasOwnProperty(name_1)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parent[name_1] = appendFunction(parent, parent[name_1], methods[name_1]);
        }
    }
}
//# sourceMappingURL=extendComponent.js.map