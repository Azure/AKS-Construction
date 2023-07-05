import { __assign, __extends } from "tslib";
import { getRTL, getInitials } from '../../../Utilities';
import { BaseFloatingPicker } from '../BaseFloatingPicker';
import { SuggestionItemNormal } from './PeoplePickerItems/SuggestionItemDefault';
import './PeoplePicker.scss';
/**
 * {@docCategory FloatingPeoplePicker}
 */
var BaseFloatingPeoplePicker = /** @class */ (function (_super) {
    __extends(BaseFloatingPeoplePicker, _super);
    function BaseFloatingPeoplePicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseFloatingPeoplePicker;
}(BaseFloatingPicker));
export { BaseFloatingPeoplePicker };
var FloatingPeoplePicker = /** @class */ (function (_super) {
    __extends(FloatingPeoplePicker, _super);
    function FloatingPeoplePicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FloatingPeoplePicker.defaultProps = {
        onRenderSuggestionsItem: function (props, itemProps) {
            return SuggestionItemNormal(__assign({}, props), __assign({}, itemProps));
        },
        createGenericItem: createItem,
    };
    return FloatingPeoplePicker;
}(BaseFloatingPeoplePicker));
export { FloatingPeoplePicker };
export function createItem(name, isValid) {
    var personaToConvert = {
        key: name,
        primaryText: name,
        imageInitials: '!',
        isValid: isValid,
    };
    if (!isValid) {
        personaToConvert.imageInitials = getInitials(name, getRTL());
    }
    return personaToConvert;
}
//# sourceMappingURL=FloatingPeoplePicker.js.map