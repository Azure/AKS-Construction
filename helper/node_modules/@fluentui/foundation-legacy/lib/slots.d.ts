import * as React from 'react';
import { IFactoryOptions } from './IComponent';
import { ISlot, ISlots, ISlotDefinition, ISlotFactory, ISlottableProps, ValidProps, ValidShorthand } from './ISlots';
/**
 * This function is required for any module that uses slots.
 *
 * This function is a slot resolver that automatically evaluates slot functions to generate React elements.
 * A byproduct of this resolver is that it removes slots from the React hierarchy by bypassing React.createElement.
 *
 * To use this function on a per-file basis, use the jsx directive targeting withSlots.
 * This directive must be the FIRST LINE in the file to work correctly.
 * Usage of this pragma also requires withSlots import statement.
 *
 * See React.createElement
 */
export declare function withSlots<P>(type: ISlot<P> | React.FunctionComponent<P> | string, props?: (React.Attributes & P) | null, ...children: React.ReactNode[]): ReturnType<React.FunctionComponent<P>>;
/**
 * This function creates factories that render ouput depending on the user ISlotProp props passed in.
 * @param DefaultComponent - Base component to render when not overridden by user props.
 * @param options - Factory options, including defaultProp value for shorthand prop mapping.
 * @returns ISlotFactory function used for rendering slots.
 */
export declare function createFactory<TProps extends ValidProps, TShorthandProp extends ValidShorthand = never>(DefaultComponent: React.ComponentType<TProps>, options?: IFactoryOptions<TProps>): ISlotFactory<TProps, TShorthandProp>;
/**
 * This function generates slots that can be used in JSX given a definition of slots and their corresponding types.
 * @param userProps - Props as pass to component.
 * @param slots - Slot definition object defining the default slot component for each slot.
 * @returns A set of created slots that components can render in JSX.
 */
export declare function getSlots<TComponentProps extends ISlottableProps<TComponentSlots>, TComponentSlots>(userProps: TComponentProps, slots: ISlotDefinition<Required<TComponentSlots>>): ISlots<Required<TComponentSlots>>;
