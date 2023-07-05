import { __assign, __extends } from "tslib";
import * as React from 'react';
import { getClassNames } from './ActivityItem.classNames';
import { getStyles } from './ActivityItem.styles';
import { PersonaSize, PersonaCoin } from '../../Persona';
/**
 * {@docCategory ActivityItem}
 */
var ActivityItem = /** @class */ (function (_super) {
    __extends(ActivityItem, _super);
    function ActivityItem(props) {
        var _this = _super.call(this, props) || this;
        _this._onRenderIcon = function (props) {
            if (props.activityPersonas) {
                return _this._onRenderPersonaArray(props);
            }
            else {
                return _this.props.activityIcon;
            }
        };
        _this._onRenderActivityDescription = function (props) {
            var classNames = _this._getClassNames(props);
            // eslint-disable-next-line deprecation/deprecation
            var activityDescription = props.activityDescription || props.activityDescriptionText;
            if (activityDescription) {
                return React.createElement("span", { className: classNames.activityText }, activityDescription);
            }
            return null;
        };
        _this._onRenderComments = function (props) {
            var classNames = _this._getClassNames(props);
            // eslint-disable-next-line deprecation/deprecation
            var comments = props.comments || props.commentText;
            if (!props.isCompact && comments) {
                return React.createElement("div", { className: classNames.commentText }, comments);
            }
            return null;
        };
        _this._onRenderTimeStamp = function (props) {
            var classNames = _this._getClassNames(props);
            if (!props.isCompact && props.timeStamp) {
                return React.createElement("div", { className: classNames.timeStamp }, props.timeStamp);
            }
            return null;
        };
        // If activityPersonas is an array of persona props, build the persona cluster element.
        _this._onRenderPersonaArray = function (props) {
            var classNames = _this._getClassNames(props);
            var personaElement = null;
            var activityPersonas = props.activityPersonas;
            if (activityPersonas[0].imageUrl || activityPersonas[0].imageInitials) {
                var personaList_1 = [];
                var showSize16Personas_1 = activityPersonas.length > 1 || props.isCompact;
                var personaLimit_1 = props.isCompact ? 3 : 4;
                var style_1 = undefined;
                if (props.isCompact) {
                    style_1 = {
                        display: 'inline-block',
                        width: '10px',
                        minWidth: '10px',
                        overflow: 'visible',
                    };
                }
                activityPersonas
                    .filter(function (person, index) { return index < personaLimit_1; })
                    .forEach(function (person, index) {
                    personaList_1.push(React.createElement(PersonaCoin, __assign({}, person, { key: person.key || index, className: classNames.activityPersona, 
                        // eslint-disable-next-line deprecation/deprecation
                        size: showSize16Personas_1 ? PersonaSize.size16 : PersonaSize.size32, style: style_1 })));
                });
                personaElement = React.createElement("div", { className: classNames.personaContainer }, personaList_1);
            }
            return personaElement;
        };
        return _this;
    }
    ActivityItem.prototype.render = function () {
        var _a = this.props, _b = _a.onRenderIcon, onRenderIcon = _b === void 0 ? this._onRenderIcon : _b, _c = _a.onRenderActivityDescription, onRenderActivityDescription = _c === void 0 ? this._onRenderActivityDescription : _c, _d = _a.onRenderComments, onRenderComments = _d === void 0 ? this._onRenderComments : _d, _e = _a.onRenderTimeStamp, onRenderTimeStamp = _e === void 0 ? this._onRenderTimeStamp : _e, animateBeaconSignal = _a.animateBeaconSignal, isCompact = _a.isCompact;
        var classNames = this._getClassNames(this.props);
        return (React.createElement("div", { className: classNames.root, style: this.props.style },
            (this.props.activityPersonas || this.props.activityIcon || this.props.onRenderIcon) && (React.createElement("div", { className: classNames.activityTypeIcon },
                animateBeaconSignal && isCompact && React.createElement("div", { className: classNames.pulsingBeacon }),
                onRenderIcon(this.props))),
            React.createElement("div", { className: classNames.activityContent },
                onRenderActivityDescription(this.props, this._onRenderActivityDescription),
                onRenderComments(this.props, this._onRenderComments),
                onRenderTimeStamp(this.props, this._onRenderTimeStamp))));
    };
    ActivityItem.prototype._getClassNames = function (props) {
        return getClassNames(getStyles(undefined, props.styles, props.animateBeaconSignal, props.beaconColorOne, props.beaconColorTwo, props.isCompact), props.className, props.activityPersonas, props.isCompact);
    };
    return ActivityItem;
}(React.Component));
export { ActivityItem };
//# sourceMappingURL=ActivityItem.js.map