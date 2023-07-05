import { __assign } from "tslib";
import * as React from 'react';
import { useWarnings } from '@fluentui/react-hooks';
import { FocusRects } from '@fluentui/utilities';
import { Label } from '../Label/Label';
import { useSlider } from './useSlider';
var COMPONENT_NAME = 'SliderBase';
export var SliderBase = React.forwardRef(function (props, ref) {
    var slotProps = useSlider(props, ref);
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line react-hooks/rules-of-hooks -- build-time conditional
        useWarnings({
            name: COMPONENT_NAME,
            props: props,
            mutuallyExclusive: { value: 'defaultValue' },
        });
    }
    return (React.createElement("div", __assign({}, slotProps.root),
        slotProps && React.createElement(Label, __assign({}, slotProps.label)),
        React.createElement("div", __assign({}, slotProps.container),
            props.ranged &&
                (props.vertical
                    ? slotProps.valueLabel && React.createElement(Label, __assign({}, slotProps.valueLabel))
                    : slotProps.lowerValueLabel && React.createElement(Label, __assign({}, slotProps.lowerValueLabel))),
            React.createElement("div", __assign({}, slotProps.sliderBox),
                React.createElement("div", __assign({}, slotProps.sliderLine),
                    props.ranged && React.createElement("span", __assign({}, slotProps.lowerValueThumb)),
                    React.createElement("span", __assign({}, slotProps.thumb)),
                    slotProps.zeroTick && React.createElement("span", __assign({}, slotProps.zeroTick)),
                    React.createElement("span", __assign({}, slotProps.bottomInactiveTrack)),
                    React.createElement("span", __assign({}, slotProps.activeTrack)),
                    React.createElement("span", __assign({}, slotProps.topInactiveTrack)))),
            props.ranged && props.vertical
                ? slotProps.lowerValueLabel && React.createElement(Label, __assign({}, slotProps.lowerValueLabel))
                : slotProps.valueLabel && React.createElement(Label, __assign({}, slotProps.valueLabel))),
        React.createElement(FocusRects, null)));
});
SliderBase.displayName = COMPONENT_NAME;
//# sourceMappingURL=Slider.base.js.map