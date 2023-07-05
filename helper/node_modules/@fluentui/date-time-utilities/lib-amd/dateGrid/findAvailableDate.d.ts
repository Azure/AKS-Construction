import { IAvailableDateOptions } from './dateGrid.types';
/**
 * Returns closest available date given the restriction `options`, or undefined otherwise
 * @param options - list of search options
 */
export declare const findAvailableDate: (options: IAvailableDateOptions) => Date | undefined;
