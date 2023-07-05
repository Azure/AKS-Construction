import * as React from 'react';
/**
 * DelayedRender component props.
 *
 * @public
 */
export interface IDelayedRenderProps extends React.Props<{}> {
    /**
     * Number of milliseconds to delay rendering children.
     */
    delay?: number;
}
/**
 * DelayedRender component state.
 *
 * @internal
 */
export interface IDelayedRenderState {
    /**
     * Whether the component is rendered or not.
     */
    isRendered: boolean;
}
/**
 * Utility component for delaying the render of a child component after a given delay. This component
 * requires a single child component; don't pass in many components. Wrap multiple components in a DIV
 * if necessary.
 *
 * @public
 * {@docCategory DelayedRender}
 */
export declare class DelayedRender extends React.Component<IDelayedRenderProps, IDelayedRenderState> {
    static defaultProps: {
        delay: number;
    };
    private _timeoutId;
    constructor(props: IDelayedRenderProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactElement<{}> | null;
}
