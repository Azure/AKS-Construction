import { styled } from '../../Utilities';
import { MarqueeSelectionBase } from './MarqueeSelection.base';
import { getStyles } from './MarqueeSelection.styles';
export var MarqueeSelection = 
// TODO: MarqueeSelectionBase defaultProps are not lining up with IMarqueeSelectionProps, so we have to be explicit
// with styled here. defaultProps.rootTagName doesn't appear to be used anywhere and defaultProps.rootProps is not
// in IMarqueeSelectionProps.
styled(MarqueeSelectionBase, getStyles, undefined, {
    scope: 'MarqueeSelection',
});
//# sourceMappingURL=MarqueeSelection.js.map