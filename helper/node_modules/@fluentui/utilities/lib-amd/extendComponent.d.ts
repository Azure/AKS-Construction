import * as React from 'react';
/**
 * Extends a component's lifetime methods by appending new functions to the existing lifetime functions.
 */
export declare function extendComponent<T extends React.Component>(parent: T, methods: {
    [key in keyof T]?: T[key];
}): void;
