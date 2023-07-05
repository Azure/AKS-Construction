import * as React from 'react';
/**
 * Given an element tagname and user props, filters the props to only allowed props for the given
 * element type.
 * @param tagName - Tag name (e.g. "div")
 * @param props - Props object
 * @param excludedPropNames - List of props to disallow
 */
export declare function getNativeElementProps<TAttributes extends React.HTMLAttributes<any>>(tagName: string, props: {}, excludedPropNames?: string[]): TAttributes;
