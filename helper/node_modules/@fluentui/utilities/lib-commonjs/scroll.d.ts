import { EventGroup } from './EventGroup';
/**
 * Placing this attribute on scrollable divs optimizes detection to know
 * if the div is scrollable or not (given we can avoid expensive operations
 * like getComputedStyle.)
 *
 * @public
 */
export declare const DATA_IS_SCROLLABLE_ATTRIBUTE = "data-is-scrollable";
/**
 * Allows the user to scroll within a element,
 * while preventing the user from scrolling the body
 */
export declare const allowScrollOnElement: (element: HTMLElement | null, events: EventGroup) => void;
/**
 * Same as allowScrollOnElement but does not prevent overscrolling.
 */
export declare const allowOverscrollOnElement: (element: HTMLElement | null, events: EventGroup) => void;
/**
 * Disables the body scrolling.
 *
 * @public
 */
export declare function disableBodyScroll(): void;
/**
 * Enables the body scrolling.
 *
 * @public
 */
export declare function enableBodyScroll(): void;
/**
 * Calculates the width of a scrollbar for the browser/os.
 *
 * @public
 */
export declare function getScrollbarWidth(): number;
/**
 * Traverses up the DOM for the element with the data-is-scrollable=true attribute, or returns
 * document.body.
 *
 * @public
 */
export declare function findScrollableParent(startingElement: HTMLElement | null): HTMLElement | Window | undefined | null;
