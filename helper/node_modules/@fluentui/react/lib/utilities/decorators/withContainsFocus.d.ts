import * as React from 'react';
export declare function withContainsFocus<TProps extends {
    containsFocus?: boolean;
}, S>(ComposedComponent: new (props: TProps, ...args: any[]) => React.Component<TProps, S>): any;
