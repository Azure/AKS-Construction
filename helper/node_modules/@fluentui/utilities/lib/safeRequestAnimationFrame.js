import { extendComponent } from './extendComponent';
/**
 * Generates a function to be attached to a React component, which can be called
 * as a replacement to RAF. In-flight async calls will be auto canceled if the component
 * is unmounting before the async code is executed, preventing bugs where code
 * accesses things within the component after being unmounted.
 */
export var safeRequestAnimationFrame = function (component) {
    var activeTimeouts;
    return function (cb) {
        if (!activeTimeouts) {
            activeTimeouts = new Set();
            extendComponent(component, {
                componentWillUnmount: function () {
                    activeTimeouts.forEach(function (id) { return cancelAnimationFrame(id); });
                },
            });
        }
        var timeoutId = requestAnimationFrame(function () {
            activeTimeouts.delete(timeoutId);
            cb();
        });
        activeTimeouts.add(timeoutId);
    };
};
//# sourceMappingURL=safeRequestAnimationFrame.js.map