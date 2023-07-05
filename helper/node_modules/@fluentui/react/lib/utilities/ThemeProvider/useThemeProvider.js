import { renderThemeProvider as render } from './renderThemeProvider';
import { useThemeProviderState } from './useThemeProviderState';
import { getPropsWithDefaults } from '@fluentui/utilities';
/**
 * Returns the ThemeProvider render function and calculated state, given user input, ref, and
 * a set of default prop values.
 */
export var useThemeProvider = function (props, defaultProps) {
    var state = getPropsWithDefaults(defaultProps, props);
    // Apply changes to state.
    useThemeProviderState(state);
    return {
        state: state,
        render: render,
    };
};
//# sourceMappingURL=useThemeProvider.js.map