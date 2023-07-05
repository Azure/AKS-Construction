import { create as defaultCreate } from 'react-test-renderer';
/**
 * Wrapping `create` from `react-test-renderer' with `act`.
 */
export declare function create(...args: Parameters<typeof defaultCreate>): ReturnType<typeof defaultCreate>;
