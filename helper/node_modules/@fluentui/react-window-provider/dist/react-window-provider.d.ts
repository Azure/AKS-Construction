import * as React_2 from 'react';

/**
 * Hook to access the document object. This can be overridden contextually using the `WindowProvider`.
 */
export declare const useDocument: () => Document | undefined;

/**
 * Hook to access the window object. This can be overridden contextually using the `WindowProvider`.
 */
export declare const useWindow: () => Window | undefined;

/**
 * Context for providing the window.
 */
export declare const WindowContext: React_2.Context<WindowProviderProps>;

/**
 * Component to provide the window object contextually. This is useful when rendering content to an element
 * contained within a child window or iframe element, where event handlers and styling must be projected
 * to an alternative window or document.
 */
export declare const WindowProvider: React_2.FunctionComponent<WindowProviderProps>;

/**
 * Props for the WindowProvider component.
 */
export declare type WindowProviderProps = {
    /**
     * Provide the active window.
     */
    window: Window | undefined;
};

export { }
