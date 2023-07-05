import * as React from 'react';
import { ShallowWrapper } from 'enzyme';
/**
 * Duplicated enzyme's ShallowRendererProps
 *
 * @internal
 */
export interface IShallowRendererProps {
    lifecycleExperimental?: boolean;
    disableLifecycleMethods?: boolean;
}
/**
 * ShallowUntilTarget Interface
 *
 * @internal
 */
export interface IShallowUntilTarget {
    maxTries: number;
    shallowOptions: IShallowRendererProps;
}
/**
 * An extention of enzyme's shallow function which will fail to work
 * with decorated components and/or components using the styled() function.
 * This function allows you to pass a 'target' component (e.g. ComponentBase)
 * and keep running shallow on each child component till a match is found.
 *
 * @public
 */
export declare function shallowUntilTarget<P, S>(componentInstance: React.ReactElement<P>, TargetComponent: string, options?: IShallowUntilTarget): ShallowWrapper;
