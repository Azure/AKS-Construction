import * as React from 'react';
/**
 * @deprecated Decorator usage is deprecated. Either call `getResponsiveMode` manually, or
 * use the `useResponsiveMode` hook within a function component.
 */
export interface IWithResponsiveModeState {
    responsiveMode?: ResponsiveMode;
}
export declare enum ResponsiveMode {
    /** Width \<= 479px */
    small = 0,
    /** Width \> 479px and \<= 639px */
    medium = 1,
    /** Width \> 639px and \<= 1023px */
    large = 2,
    /** Width \> 1023px and \<= 1365px */
    xLarge = 3,
    /** Width \> 1365px and \<= 1919px */
    xxLarge = 4,
    /** Width \> 1919px */
    xxxLarge = 5,
    unknown = 999
}
/**
 * Allows a server rendered scenario to provide a **default** responsive mode.
 * This WILL NOT trigger any updates to components that have already consumed the responsive mode!
 */
export declare function setResponsiveMode(responsiveMode: ResponsiveMode | undefined): void;
/**
 * Initializes the responsive mode to the current window size. This can be used to avoid
 * a re-render during first component mount since the window would otherwise not be measured
 * until after mounting.
 *
 * This WILL NOT trigger any updates to components that have already consumed the responsive mode!
 */
export declare function initializeResponsiveMode(element?: HTMLElement): void;
export declare function getInitialResponsiveMode(): ResponsiveMode;
/**
 * @deprecated Decorator usage is deprecated. Either call `getResponsiveMode` manually, or
 * use the `useResponsiveMode` hook within a function component.
 */
export declare function withResponsiveMode<TProps extends {
    responsiveMode?: ResponsiveMode;
}, TState>(ComposedComponent: new (props: TProps, ...args: any[]) => React.Component<TProps, TState>): any;
/**
 * Hook to get the current responsive mode (window size category).
 * @param currentWindow - Use this window when determining the responsive mode.
 */
export declare function getResponsiveMode(currentWindow: Window | undefined): ResponsiveMode;
