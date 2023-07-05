import * as React from 'react';
export declare type IRefObject<T> = React.RefObject<T> | RefObject<T> | ((ref: T | null) => void);
export declare type RefObject<T> = {
    (component: T | null): void;
    current: T | null;
};
