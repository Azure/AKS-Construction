import { __assign } from "tslib";
import { withSlots, createComponent, getSlots } from '@fluentui/foundation-legacy';
import { getNativeProps, htmlElementProperties } from '../../../Utilities';
import { StackItemStyles as styles } from './StackItem.styles';
var StackItemView = function (props) {
    var children = props.children;
    var nativeProps = getNativeProps(props, htmlElementProperties);
    // eslint-disable-next-line eqeqeq
    if (children == null) {
        return null;
    }
    var Slots = getSlots(props, {
        root: 'div',
    });
    return withSlots(Slots.root, __assign({}, nativeProps), children);
};
export var StackItem = createComponent(StackItemView, {
    displayName: 'StackItem',
    styles: styles,
});
export default StackItem;
//# sourceMappingURL=StackItem.js.map