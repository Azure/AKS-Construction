import { shallow } from 'enzyme';
/**
 * An extention of enzyme's shallow function which will fail to work
 * with decorated components and/or components using the styled() function.
 * This function allows you to pass a 'target' component (e.g. ComponentBase)
 * and keep running shallow on each child component till a match is found.
 *
 * @public
 */
export function shallowUntilTarget(componentInstance, TargetComponent, options) {
    if (options === void 0) { options = {
        maxTries: 10,
        shallowOptions: {},
    }; }
    var maxTries = options.maxTries, shallowOptions = options.shallowOptions;
    var root = shallow(componentInstance, shallowOptions);
    var rootType = root.type();
    if (typeof rootType === 'string' || rootType.toString().indexOf(TargetComponent) !== -1) {
        // Default shallow()
        // If type() is a string then it's a DOM Node.
        // If it were wrapped, it would be a React component.
        return root;
    }
    for (var tries = 1; tries <= maxTries; tries++) {
        // Check for target as a string to avoid conflicts
        // with decoratored components name
        if (rootType.toString().indexOf(TargetComponent) !== -1) {
            // Now that we found the target component, render it.
            return root.first().shallow(shallowOptions);
        }
        // Unwrap the next component in the hierarchy.
        root = root.first().shallow(shallowOptions);
        rootType = root.type();
    }
    throw new Error("Could not find " + TargetComponent + " in React instance: " + componentInstance + ";\n    gave up after " + maxTries + " tries");
}
//# sourceMappingURL=shallowUntilTarget.js.map