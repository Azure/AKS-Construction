import { __assign } from "tslib";
import * as React from 'react';
import { Image } from '../Image/Image';
import { css, getNativeProps, htmlElementProperties } from '../../Utilities';
import { classNames, MS_ICON } from './Icon.styles';
/**
 * Fast icon component which only supports images (not font glyphs) and can't be targeted by customizations.
 * To style the icon, use `className` or reference `ms-Icon` in CSS.
 * {@docCategory Icon}
 */
export var ImageIcon = function (props) {
    var className = props.className, imageProps = props.imageProps;
    var nativeProps = getNativeProps(props, htmlElementProperties, [
        'aria-label',
        'aria-labelledby',
        'title',
        'aria-describedby',
    ]);
    var altText = imageProps.alt || props['aria-label'];
    var hasName = altText ||
        props['aria-labelledby'] ||
        props.title ||
        imageProps['aria-label'] ||
        imageProps['aria-labelledby'] ||
        imageProps.title;
    // move naming or describing attributes from the container (where they are invalid) to the image
    var imageNameProps = {
        'aria-labelledby': props['aria-labelledby'],
        'aria-describedby': props['aria-describedby'],
        title: props.title,
    };
    var containerProps = hasName
        ? {}
        : {
            'aria-hidden': true,
        };
    return (React.createElement("div", __assign({}, containerProps, nativeProps, { className: css(MS_ICON, classNames.root, classNames.image, className) }),
        React.createElement(Image, __assign({}, imageNameProps, imageProps, { alt: hasName ? altText : '' }))));
};
//# sourceMappingURL=ImageIcon.js.map