import { warn } from './warn';
/**
 * Warns when two props which are mutually exclusive are both being used.
 *
 * @public
 * @param componentName - The name of the component being used.
 * @param props - The props passed into the component.
 * @param exclusiveMap - A map where the key is a parameter, and the value is the other parameter.
 */
export function warnMutuallyExclusive(componentName, props, exclusiveMap) {
    if (process.env.NODE_ENV !== 'production') {
        for (var propName in exclusiveMap) {
            if (props && props[propName] !== undefined) {
                var propInExclusiveMapValue = exclusiveMap[propName];
                if (propInExclusiveMapValue && props[propInExclusiveMapValue] !== undefined) {
                    warn(componentName + " property '" + propName + "' is mutually exclusive with '" + exclusiveMap[propName] + "'. " +
                        "Use one or the other.");
                }
            }
        }
    }
}
//# sourceMappingURL=warnMutuallyExclusive.js.map