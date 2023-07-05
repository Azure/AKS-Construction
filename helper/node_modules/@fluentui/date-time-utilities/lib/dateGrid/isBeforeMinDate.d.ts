import { IRestrictedDatesOptions } from './dateGrid.types';
/**
 * Checks if `date` happens earlier than min date
 * @param date - date to check
 * @param options - object with min date to check against
 */
export declare const isBeforeMinDate: (date: Date, options: IRestrictedDatesOptions) => boolean;
