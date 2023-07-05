import { ReactWrapper } from 'enzyme';
/**
 * Injects a function call prior to running a method for a component
 * rendered using enzyme deep rendering.
 * @param wrapper - The enzyme deep rendering wrapper object to modify
 * @param methodName - The name of the method to modify on the wrapper
 * @param fn - The function to run prior to the call of the original method
 */
export declare function injectWrapperMethod(wrapper: ReactWrapper<{}, {}>, methodName: string, fn: () => void): void;
