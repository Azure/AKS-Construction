define(["require", "exports", "./extendComponent"], function (require, exports, extendComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initializeComponentRef = void 0;
    /**
     * Helper to manage componentRef resolution. Internally appends logic to
     * lifetime methods to resolve componentRef to the passed in object.
     *
     * Usage: call initializeComponentRef(this) in the constructor,
     */
    function initializeComponentRef(obj) {
        extendComponent_1.extendComponent(obj, {
            componentDidMount: _onMount,
            componentDidUpdate: _onUpdate,
            componentWillUnmount: _onUnmount,
        });
    }
    exports.initializeComponentRef = initializeComponentRef;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _onMount() {
        _setComponentRef(this.props.componentRef, this);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _onUpdate(prevProps) {
        if (prevProps.componentRef !== this.props.componentRef) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            _setComponentRef(prevProps.componentRef, null);
            _setComponentRef(this.props.componentRef, this);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _onUnmount() {
        _setComponentRef(this.props.componentRef, null);
    }
    function _setComponentRef(componentRef, value) {
        if (componentRef) {
            if (typeof componentRef === 'object') {
                componentRef.current = value;
            }
            else if (typeof componentRef === 'function') {
                componentRef(value);
            }
        }
    }
});
//# sourceMappingURL=initializeComponentRef.js.map