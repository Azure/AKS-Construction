import * as React from 'react';
export declare class BaseDecorator<TProps, TState> extends React.Component<TProps, TState> {
    protected _composedComponentInstance: React.Component<TProps, TState>;
    private _hoisted;
    constructor(props: TProps);
    /**
     * Updates the ref to the component composed by the decorator, which will also take care of hoisting
     * (and unhoisting as appropriate) methods from said component.
     *
     * Pass this method as the argument to the 'ref' property of the composed component.
     */
    protected _updateComposedComponentRef(composedComponentInstance: React.Component<TProps, TState>): void;
}
