import { IRestrictedDatesOptions } from './dateGrid.types';
/**
 * Checks if `date` happens later than max date
 * @param date - date to check
 * @param options - object with max date to check against
 */
export declare const isAfterMaxDate: (date: Date, options: IRestrictedDatesOptions) => boolean;
