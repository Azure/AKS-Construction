import * as React from 'react';
export var SPACER_WIDTH = 36;
export var GroupSpacer = function (props) {
    var count = props.count, _a = props.indentWidth, indentWidth = _a === void 0 ? SPACER_WIDTH : _a, _b = props.role, role = _b === void 0 ? 'presentation' : _b;
    var width = count * indentWidth;
    return count > 0 ? (React.createElement("span", { className: 'ms-GroupSpacer', style: { display: 'inline-block', width: width }, role: role })) : null;
};
//# sourceMappingURL=GroupSpacer.js.map