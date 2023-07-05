import { extendComponent } from './extendComponent';
/**
 * Generates a function to be attached to a React component, which can be called
 * as a replacement to setTimeout. In-flight async calls will be auto canceled if the component
 * is unmounting before the async code is executed, preventing bugs where code
 * accesses things within the component after being unmounted.
 */
export var safeSetTimeout = function (component) {
    var activeTimeouts;
    return function (cb, duration) {
        if (!activeTimeouts) {
            activeTimeouts = new Set();
            extendComponent(component, {
                componentWillUnmount: function () {
                    activeTimeouts.forEach(function (id) { return clearTimeout(id); });
                },
            });
        }
        var timeoutId = setTimeout(function () {
            activeTimeouts.delete(timeoutId);
            cb();
        }, duration);
        activeTimeouts.add(timeoutId);
    };
};
//# sourceMappingURL=safeSetTimeout.js.map