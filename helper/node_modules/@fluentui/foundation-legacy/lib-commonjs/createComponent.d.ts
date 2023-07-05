import * as React from 'react';
import { IStyleSet } from '@fluentui/style-utilities';
import { IComponentOptions, IViewComponent } from './IComponent';
import { ValidProps } from './ISlots';
/**
 * Assembles a higher order component based on the following: styles, theme, view, and state.
 * Imposes a separation of concern and centralizes styling processing to increase ease of use and robustness
 * in how components use and apply styling and theming.
 *
 * Automatically merges and applies themes and styles with theme / styleprops having the highest priority.
 * State component, if provided, is passed in props for processing. Props from state / user are automatically processed
 * and styled before finally being passed to view.
 *
 * State components should contain all stateful behavior and should not generate any JSX, but rather simply call
 * the view prop.
 *
 * Views should simply be stateless pure functions that receive all props needed for rendering their output.
 *
 * State component is optional. If state is not provided, created component is essentially a functional
 * stateless component.
 *
 * @param options - component Component options. See IComponentOptions for more detail.
 */
export declare function createComponent<TComponentProps extends ValidProps, TTokens, TStyleSet extends IStyleSet<TStyleSet>, TViewProps extends TComponentProps = TComponentProps, TStatics = {}>(view: IViewComponent<TViewProps>, options?: IComponentOptions<TComponentProps, TTokens, TStyleSet, TViewProps, TStatics>): React.FunctionComponent<TComponentProps> & TStatics;
