import { styled } from '../../Utilities';
import { CommandBarBase } from './CommandBar.base';
import { getStyles } from './CommandBar.styles';
// Create a CommandBar variant which uses these default styles and this styled subcomponent.
export var CommandBar = styled(CommandBarBase, getStyles, undefined, {
    scope: 'CommandBar',
});
//# sourceMappingURL=CommandBar.js.map