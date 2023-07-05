import { getDocument } from './dom/getDocument';
import { mergeStyles } from '@fluentui/merge-styles';
import { getWindow } from './dom/getWindow';
var _scrollbarWidth;
var _bodyScrollDisabledCount = 0;
var DisabledScrollClassName = mergeStyles({
    overflow: 'hidden !important',
});
/**
 * Placing this attribute on scrollable divs optimizes detection to know
 * if the div is scrollable or not (given we can avoid expensive operations
 * like getComputedStyle.)
 *
 * @public
 */
export var DATA_IS_SCROLLABLE_ATTRIBUTE = 'data-is-scrollable';
/**
 * Allows the user to scroll within a element,
 * while preventing the user from scrolling the body
 */
export var allowScrollOnElement = function (element, events) {
    if (!element) {
        return;
    }
    var _previousClientY = 0;
    var _element = null;
    // remember the clientY for future calls of _preventOverscrolling
    var _saveClientY = function (event) {
        if (event.targetTouches.length === 1) {
            _previousClientY = event.targetTouches[0].clientY;
        }
    };
    // prevent the body from scrolling when the user attempts
    // to scroll past the top or bottom of the element
    var _preventOverscrolling = function (event) {
        // only respond to a single-finger touch
        if (event.targetTouches.length !== 1) {
            return;
        }
        // prevent the body touchmove handler from firing
        // so that scrolling is allowed within the element
        event.stopPropagation();
        if (!_element) {
            return;
        }
        var clientY = event.targetTouches[0].clientY - _previousClientY;
        var scrollableParent = findScrollableParent(event.target);
        if (scrollableParent) {
            _element = scrollableParent;
        }
        // if the element is scrolled to the top,
        // prevent the user from scrolling up
        if (_element.scrollTop === 0 && clientY > 0) {
            event.preventDefault();
        }
        // if the element is scrolled to the bottom,
        // prevent the user from scrolling down
        if (_element.scrollHeight - Math.ceil(_element.scrollTop) <= _element.clientHeight && clientY < 0) {
            event.preventDefault();
        }
    };
    events.on(element, 'touchstart', _saveClientY, { passive: false });
    events.on(element, 'touchmove', _preventOverscrolling, { passive: false });
    _element = element;
};
/**
 * Same as allowScrollOnElement but does not prevent overscrolling.
 */
export var allowOverscrollOnElement = function (element, events) {
    if (!element) {
        return;
    }
    var _allowElementScroll = function (event) {
        event.stopPropagation();
    };
    events.on(element, 'touchmove', _allowElementScroll, { passive: false });
};
var _disableIosBodyScroll = function (event) {
    event.preventDefault();
};
/**
 * Disables the body scrolling.
 *
 * @public
 */
export function disableBodyScroll() {
    var doc = getDocument();
    if (doc && doc.body && !_bodyScrollDisabledCount) {
        doc.body.classList.add(DisabledScrollClassName);
        doc.body.addEventListener('touchmove', _disableIosBodyScroll, { passive: false, capture: false });
    }
    _bodyScrollDisabledCount++;
}
/**
 * Enables the body scrolling.
 *
 * @public
 */
export function enableBodyScroll() {
    if (_bodyScrollDisabledCount > 0) {
        var doc = getDocument();
        if (doc && doc.body && _bodyScrollDisabledCount === 1) {
            doc.body.classList.remove(DisabledScrollClassName);
            doc.body.removeEventListener('touchmove', _disableIosBodyScroll);
        }
        _bodyScrollDisabledCount--;
    }
}
/**
 * Calculates the width of a scrollbar for the browser/os.
 *
 * @public
 */
export function getScrollbarWidth() {
    if (_scrollbarWidth === undefined) {
        var scrollDiv = document.createElement('div');
        scrollDiv.style.setProperty('width', '100px');
        scrollDiv.style.setProperty('height', '100px');
        scrollDiv.style.setProperty('overflow', 'scroll');
        scrollDiv.style.setProperty('position', 'absolute');
        scrollDiv.style.setProperty('top', '-9999px');
        document.body.appendChild(scrollDiv);
        // Get the scrollbar width
        _scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        // Delete the DIV
        document.body.removeChild(scrollDiv);
    }
    return _scrollbarWidth;
}
/**
 * Traverses up the DOM for the element with the data-is-scrollable=true attribute, or returns
 * document.body.
 *
 * @public
 */
export function findScrollableParent(startingElement) {
    var el = startingElement;
    var doc = getDocument(startingElement);
    // First do a quick scan for the scrollable attribute.
    while (el && el !== doc.body) {
        if (el.getAttribute(DATA_IS_SCROLLABLE_ATTRIBUTE) === 'true') {
            return el;
        }
        el = el.parentElement;
    }
    // If we haven't found it, the use the slower method: compute styles to evaluate if overflow is set.
    el = startingElement;
    while (el && el !== doc.body) {
        if (el.getAttribute(DATA_IS_SCROLLABLE_ATTRIBUTE) !== 'false') {
            var computedStyles = getComputedStyle(el);
            var overflowY = computedStyles ? computedStyles.getPropertyValue('overflow-y') : '';
            if (overflowY && (overflowY === 'scroll' || overflowY === 'auto')) {
                return el;
            }
        }
        el = el.parentElement;
    }
    // Fall back to window scroll.
    if (!el || el === doc.body) {
        el = getWindow(startingElement);
    }
    return el;
}
//# sourceMappingURL=scroll.js.map