import { EventGroup } from './EventGroup';
import { findScrollableParent } from './scroll';
import { getRect } from './dom/getRect';
var SCROLL_ITERATION_DELAY = 16;
var SCROLL_GUTTER = 100;
var MAX_SCROLL_VELOCITY = 15;
/**
 * AutoScroll simply hooks up mouse events given a parent element, and scrolls the container
 * up/down depending on how close the mouse is to the top/bottom of the container.
 *
 * Once you don't want autoscroll any more, just dispose the helper and it will unhook events.
 *
 * @public
 * {@docCategory AutoScroll}
 */
var AutoScroll = /** @class */ (function () {
    function AutoScroll(element) {
        this._events = new EventGroup(this);
        this._scrollableParent = findScrollableParent(element);
        this._incrementScroll = this._incrementScroll.bind(this);
        this._scrollRect = getRect(this._scrollableParent);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this._scrollableParent === window) {
            this._scrollableParent = document.body;
        }
        if (this._scrollableParent) {
            this._events.on(window, 'mousemove', this._onMouseMove, true);
            this._events.on(window, 'touchmove', this._onTouchMove, true);
        }
    }
    AutoScroll.prototype.dispose = function () {
        this._events.dispose();
        this._stopScroll();
    };
    AutoScroll.prototype._onMouseMove = function (ev) {
        this._computeScrollVelocity(ev);
    };
    AutoScroll.prototype._onTouchMove = function (ev) {
        if (ev.touches.length > 0) {
            this._computeScrollVelocity(ev);
        }
    };
    AutoScroll.prototype._computeScrollVelocity = function (ev) {
        if (!this._scrollRect) {
            return;
        }
        var clientX;
        var clientY;
        if ('clientX' in ev) {
            clientX = ev.clientX;
            clientY = ev.clientY;
        }
        else {
            clientX = ev.touches[0].clientX;
            clientY = ev.touches[0].clientY;
        }
        var scrollRectTop = this._scrollRect.top;
        var scrollRectLeft = this._scrollRect.left;
        var scrollClientBottom = scrollRectTop + this._scrollRect.height - SCROLL_GUTTER;
        var scrollClientRight = scrollRectLeft + this._scrollRect.width - SCROLL_GUTTER;
        // variables to use for alternating scroll direction
        var scrollRect;
        var clientDirection;
        var scrollClient;
        // if either of these conditions are met we are scrolling vertically else horizontally
        if (clientY < scrollRectTop + SCROLL_GUTTER || clientY > scrollClientBottom) {
            clientDirection = clientY;
            scrollRect = scrollRectTop;
            scrollClient = scrollClientBottom;
            this._isVerticalScroll = true;
        }
        else {
            clientDirection = clientX;
            scrollRect = scrollRectLeft;
            scrollClient = scrollClientRight;
            this._isVerticalScroll = false;
        }
        // calculate scroll velocity and direction
        if (clientDirection < scrollRect + SCROLL_GUTTER) {
            this._scrollVelocity = Math.max(-MAX_SCROLL_VELOCITY, -MAX_SCROLL_VELOCITY * ((SCROLL_GUTTER - (clientDirection - scrollRect)) / SCROLL_GUTTER));
        }
        else if (clientDirection > scrollClient) {
            this._scrollVelocity = Math.min(MAX_SCROLL_VELOCITY, MAX_SCROLL_VELOCITY * ((clientDirection - scrollClient) / SCROLL_GUTTER));
        }
        else {
            this._scrollVelocity = 0;
        }
        if (this._scrollVelocity) {
            this._startScroll();
        }
        else {
            this._stopScroll();
        }
    };
    AutoScroll.prototype._startScroll = function () {
        if (!this._timeoutId) {
            this._incrementScroll();
        }
    };
    AutoScroll.prototype._incrementScroll = function () {
        if (this._scrollableParent) {
            if (this._isVerticalScroll) {
                this._scrollableParent.scrollTop += Math.round(this._scrollVelocity);
            }
            else {
                this._scrollableParent.scrollLeft += Math.round(this._scrollVelocity);
            }
        }
        this._timeoutId = setTimeout(this._incrementScroll, SCROLL_ITERATION_DELAY);
    };
    AutoScroll.prototype._stopScroll = function () {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            delete this._timeoutId;
        }
    };
    return AutoScroll;
}());
export { AutoScroll };
//# sourceMappingURL=AutoScroll.js.map