import { styled } from '../../Utilities';
import { IconBase } from './Icon.base';
import { getStyles } from './Icon.styles';
/**
 * Legacy Icon component which can be targeted by customization. It's recommended to use `FontIcon`
 * or `ImageIcon` instead, especially in scenarios where rendering performance is important.
 * {@docCategory Icon}
 */
export var Icon = styled(IconBase, getStyles, undefined, {
    scope: 'Icon',
}, true);
Icon.displayName = 'Icon';
//# sourceMappingURL=Icon.js.map