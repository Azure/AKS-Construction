import { useRef, useEffect } from 'react';
/**
 * Hook keeping track of a given value from a previous execution of the component the Hook is used in.
 *
 * See [React Hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)
 */
export function usePrevious(value) {
    var ref = useRef();
    useEffect(function () {
        ref.current = value;
    });
    return ref.current;
}
//# sourceMappingURL=usePrevious.js.map