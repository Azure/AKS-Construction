import { __assign, __rest } from "tslib";
/** @jsxRuntime classic */
/** @jsx withSlots */
import { withSlots, getSlots } from '@fluentui/foundation-legacy';
import { getNativeProps, htmlElementProperties } from '../../Utilities';
export var TextView = function (props) {
    // eslint-disable-next-line eqeqeq
    if (props.children == null) {
        return null;
    }
    var block = props.block, className = props.className, _a = props.as, RootType = _a === void 0 ? 'span' : _a, variant = props.variant, nowrap = props.nowrap, rest = __rest(props, ["block", "className", "as", "variant", "nowrap"]);
    var Slots = getSlots(props, {
        root: RootType,
    });
    return withSlots(Slots.root, __assign({}, getNativeProps(rest, htmlElementProperties)));
};
//# sourceMappingURL=Text.view.js.map