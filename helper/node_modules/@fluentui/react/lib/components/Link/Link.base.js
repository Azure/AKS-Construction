import { __assign } from "tslib";
import * as React from 'react';
import { useLink } from './useLink';
export var LinkBase = React.forwardRef(function (props, ref) {
    var _a = useLink(props, ref), slots = _a.slots, slotProps = _a.slotProps;
    return React.createElement(slots.root, __assign({}, slotProps.root));
});
LinkBase.displayName = 'LinkBase';
//# sourceMappingURL=Link.base.js.map