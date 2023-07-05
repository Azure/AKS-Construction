import { __assign } from "tslib";
import * as React from 'react';
import { Callout } from './Callout';
import { FocusTrapZone } from '../../FocusTrapZone';
/**
 * A special Callout that uses FocusTrapZone to trap focus
 * @param props - Props for the component
 */
export var FocusTrapCallout = function (props) {
    return (React.createElement(Callout, __assign({}, props),
        React.createElement(FocusTrapZone, __assign({ disabled: props.hidden }, props.focusTrapProps), props.children)));
};
//# sourceMappingURL=FocusTrapCallout.js.map