import { __assign, __extends } from "tslib";
import * as React from 'react';
import { getNativeProps, divProperties, initializeComponentRef, warnDeprecations } from '@fluentui/utilities';
var COMPONENT_NAME = 'PivotItem';
var PivotItem = /** @class */ (function (_super) {
    __extends(PivotItem, _super);
    function PivotItem(props) {
        var _this = _super.call(this, props) || this;
        initializeComponentRef(_this);
        warnDeprecations(COMPONENT_NAME, props, {
            linkText: 'headerText',
        });
        return _this;
    }
    PivotItem.prototype.render = function () {
        return React.createElement("div", __assign({}, getNativeProps(this.props, divProperties)), this.props.children);
    };
    return PivotItem;
}(React.Component));
export { PivotItem };
//# sourceMappingURL=PivotItem.js.map