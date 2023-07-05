/**
 * Validate that value(s) returned by a hook do not change in identity.
 * @param testDescription - Custom test description
 * @param useHook - Function to invoke the hook and return an array of return values which
 * should not change
 * @param useHookAgain - If you want to verify that the return value doesn't change when hook
 * parameters change, you can pass this second callback which calls the hook differently.
 */
export declare function validateHookValueNotChanged<TValues extends NonNullable<any>[]>(testDescription: string, useHook: () => TValues, useHookAgain?: () => TValues): void;
