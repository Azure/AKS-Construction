import { IRestrictedDatesOptions } from './dateGrid.types';
/**
 * Checks if `date` falls into the restricted `options`
 * @param date - date to check
 * @param options - restriction options (min date, max date and list of restricted dates)
 */
export declare const isRestrictedDate: (date: Date, options: IRestrictedDatesOptions) => boolean;
