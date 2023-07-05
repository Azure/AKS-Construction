import { __extends } from "tslib";
import * as React from 'react';
import { initializeComponentRef } from '../../../../Utilities';
import { ContextualMenu, DirectionalHint } from '../../../../ContextualMenu';
var SelectedItemWithContextMenu = /** @class */ (function (_super) {
    __extends(SelectedItemWithContextMenu, _super);
    function SelectedItemWithContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.itemElement = React.createRef();
        _this._onClick = function (ev) {
            ev.preventDefault();
            if (_this.props.beginEditing && !_this.props.item.isValid) {
                _this.props.beginEditing(_this.props.item);
            }
            else {
                _this.setState({ contextualMenuVisible: true });
            }
        };
        _this._onCloseContextualMenu = function (ev) {
            _this.setState({ contextualMenuVisible: false });
        };
        initializeComponentRef(_this);
        _this.state = { contextualMenuVisible: false };
        return _this;
    }
    SelectedItemWithContextMenu.prototype.render = function () {
        return (React.createElement("div", { ref: this.itemElement, onContextMenu: this._onClick },
            this.props.renderedItem,
            this.state.contextualMenuVisible ? (React.createElement(ContextualMenu, { items: this.props.menuItems, shouldFocusOnMount: true, target: this.itemElement.current, onDismiss: this._onCloseContextualMenu, directionalHint: DirectionalHint.bottomLeftEdge })) : null));
    };
    return SelectedItemWithContextMenu;
}(React.Component));
export { SelectedItemWithContextMenu };
//# sourceMappingURL=SelectedItemWithContextMenu.js.map