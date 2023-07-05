import * as React from 'react';
import { IStyleSet } from '@fluentui/style-utilities';
import { IComponentOptions, IPartialSlotComponent, IRecompositionComponentOptions, ISlotComponent } from './IComponent';
import { ValidProps, ISlottableProps, ISlotDefinition } from '../ISlots';
import { IFoundationComponent } from './ISlots';
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
export declare function composed<TComponentProps extends ValidProps & ISlottableProps<TComponentSlots>, TTokens, TStyleSet extends IStyleSet<TStyleSet>, TViewProps extends TComponentProps = TComponentProps, TComponentSlots = {}, TStatics = {}>(options: IComponentOptions<TComponentProps, TTokens, TStyleSet, TViewProps, TComponentSlots, TStatics>): IFoundationComponent<TComponentProps, TTokens, TStyleSet, TViewProps, TComponentSlots, TStatics> & TStatics;
/**
 * Recomposes a functional component based on a base component and the following set of options: styles, theme, view,
 * and state. Imposes a separation of concern and centralizes styling processing to increase ease of use and robustness
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
 * @param baseComponent - base component to recompose
 * @param options - component Component recomposition options. See IComponentOptions for more detail.
 */
export declare function composed<TComponentProps extends ValidProps & ISlottableProps<TComponentSlots>, TTokens, TStyleSet extends IStyleSet<TStyleSet>, TViewProps extends TComponentProps = TComponentProps, TComponentSlots = {}, TStatics = {}>(baseComponent: React.FunctionComponent, options: IRecompositionComponentOptions<TComponentProps, TTokens, TStyleSet, TViewProps, TComponentSlots, TStatics>): IFoundationComponent<TComponentProps, TTokens, TStyleSet, TViewProps, TComponentSlots, TStatics> & TStatics;
/**
 * Resolve the passed slots as a function or an object.
 *
 * @param slots - Slots that need to be resolved as a function or an object.
 * @param data - Data to pass to resolve if the first argument was a function.
 */
export declare function resolveSlots<TComponentProps extends ISlottableProps<TComponentSlots>, TComponentSlots>(slots: IPartialSlotComponent<TComponentProps, TComponentSlots> | ISlotComponent<TComponentProps, TComponentSlots> | undefined, data: TComponentProps): ISlotDefinition<Required<TComponentSlots>>;
