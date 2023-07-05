import * as React from 'react';
import { IStyle, IStyleSet, ITheme } from '@fluentui/style-utilities';
/**
 * Helper interface for accessing user props children.
 * @deprecated Use React.PropsWithChildren.
 */
export declare type IPropsWithChildren<TProps> = React.PropsWithChildren<TProps>;
/**
 * Helper type defining style sections, one for each component slot.
 */
export declare type IComponentStyles<TSlots> = {
    [key in keyof TSlots]?: IStyle;
};
/**
 * Function declaration for component styles functions.
 */
export declare type IStylesFunction<TViewProps, TTokens, TStyleSet extends IStyleSet<TStyleSet>> = (props: TViewProps, theme: ITheme, tokens: TTokens) => TStyleSet;
/**
 * Composite type for component styles functions and objects.
 */
export declare type IStylesFunctionOrObject<TViewProps, TTokens, TStyleSet extends IStyleSet<TStyleSet>> = IStylesFunction<TViewProps, TTokens, TStyleSet> | TStyleSet;
/**
 * Tokens can be defined as an object, function, or an array of objects and functions.
 */
export declare type IToken<TViewProps, TTokens> = ITokenBase<TViewProps, TTokens> | ITokenBaseArray<TViewProps, TTokens>;
/**
 * Function declaration for component token functions.
 */
export declare type ITokenFunction<TViewProps, TTokens> = (props: TViewProps, theme: ITheme) => IToken<TViewProps, TTokens>;
/**
 * Composite type for component token functions and objects.
 */
export declare type ITokenFunctionOrObject<TViewProps, TTokens> = ITokenFunction<TViewProps, TTokens> | TTokens;
/**
 * Composite base type that includes all possible resolutions of token functions in an array.
 */
export declare type ITokenBase<TViewProps, TTokens> = ITokenFunctionOrObject<TViewProps, TTokens> | false | null | undefined;
/**
 * Composite token base array type allowing for token objects, functions, and function resolutions.
 */
export interface ITokenBaseArray<TViewProps, TTokens> extends Array<IToken<TViewProps, TTokens>> {
}
/**
 * Optional props for styleable components. If these props are present, they will automatically be
 * used by Foundation when applying theming and styling.
 */
export interface IStyleableComponentProps<TViewProps, TTokens, TStyleSet extends IStyleSet<TStyleSet>> {
    className?: string;
    styles?: IStylesFunctionOrObject<TViewProps, TTokens, TStyleSet>;
    theme?: ITheme;
    tokens?: ITokenFunctionOrObject<TViewProps, TTokens>;
}
export declare type ICustomizationProps<TViewProps, TTokens, TStyleSet extends IStyleSet<TStyleSet>> = IStyleableComponentProps<TViewProps, TTokens, TStyleSet> & Required<Pick<IStyleableComponentProps<TViewProps, TTokens, TStyleSet>, 'theme'>>;
/**
 * Defines the contract for state components.
 */
export declare type IStateComponentType<TComponentProps, TViewProps> = (props: Readonly<TComponentProps>) => TViewProps;
/**
 * Defines the contract for view components.
 */
export declare type IViewComponent<TViewProps> = (props: React.PropsWithChildren<TViewProps>) => ReturnType<React.FunctionComponent>;
/**
 * Component options used by foundation to tie elements together.
 *
 * * TComponentProps: A styleable props interface for the created component.
 * * TTokens: The type for tokens props.
 * * TStyleSet: The type for styles properties.
 * * TViewProps: The props specific to the view, including processed properties outputted by optional state component.
 * If state component is not provided, TComponentProps is the same as TViewProps.
 * * TStatics: Static type for statics applied to created component object.
 */
export interface IComponentOptions<TComponentProps, TTokens, TStyleSet extends IStyleSet<TStyleSet>, TViewProps = TComponentProps, TStatics = {}> {
    /**
     * Display name to identify component in React hierarchy. This parameter is required for targeted component styling
     * via theming.
     */
    displayName?: string;
    /**
     * List of fields which can be customized.
     */
    fields?: string[];
    /**
     * Styles prop to pass into component.
     */
    styles?: IStylesFunctionOrObject<TViewProps, TTokens, TStyleSet>;
    /**
     * Optional state component that processes TComponentProps into TViewProps.
     */
    state?: IStateComponentType<TComponentProps, TViewProps>;
    /**
     * Optional static object to assign to constructed component.
     */
    statics?: TStatics;
    /**
     * Tokens prop to pass into component.
     */
    tokens?: ITokenFunctionOrObject<TViewProps, TTokens>;
    /**
     * Default prop for which to map primitive values.
     */
    factoryOptions?: IFactoryOptions<TComponentProps>;
}
/**
 * Component helper that defines options as required for ease of use by component consumers.
 */
export declare type IComponent<TComponentProps, TTokens, TStyleSet extends IStyleSet<TStyleSet>, TViewProps = TComponentProps, TStatics = {}> = Required<IComponentOptions<TComponentProps, TTokens, TStyleSet, TViewProps, TStatics>> & {
    /**
     * Component that generates view output.
     */
    view: IViewComponent<TViewProps>;
};
/**
 * Factory options for creating component.
 */
export interface IFactoryOptions<TProps> {
    /**
     * Default prop for which to map primitive values.
     */
    defaultProp?: keyof TProps | 'children';
}
