/**
 * AutoScroll simply hooks up mouse events given a parent element, and scrolls the container
 * up/down depending on how close the mouse is to the top/bottom of the container.
 *
 * Once you don't want autoscroll any more, just dispose the helper and it will unhook events.
 *
 * @public
 * {@docCategory AutoScroll}
 */
export declare class AutoScroll {
    private _events;
    private _scrollableParent;
    private _scrollRect;
    private _scrollVelocity;
    private _isVerticalScroll;
    private _timeoutId?;
    constructor(element: HTMLElement);
    dispose(): void;
    private _onMouseMove;
    private _onTouchMove;
    private _computeScrollVelocity;
    private _startScroll;
    private _incrementScroll;
    private _stopScroll;
}
