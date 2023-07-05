import { useContext } from 'react';
import { useCustomizationSettings } from '@fluentui/utilities';
import { createTheme } from '@fluentui/theme';
import { ThemeContext } from './ThemeContext';
/**
 * Get theme from CustomizerContext or Customizations singleton.
 */
function useCompatTheme() {
    return useCustomizationSettings(['theme']).theme;
}
/**
 * React hook for programmatically accessing the theme.
 */
export var useTheme = function () {
    var theme = useContext(ThemeContext);
    var legacyTheme = useCompatTheme();
    return theme || legacyTheme || createTheme({});
};
//# sourceMappingURL=useTheme.js.map