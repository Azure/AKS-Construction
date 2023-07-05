import { IDay, IDayGridOptions } from './dateGrid.types';
/**
 * Generates a grid of days, given the `options`.
 * Returns one additional week at the begining from the previous range
 * and one at the end from the future range
 * @param options - parameters to specify date related restrictions for the resulting grid
 */
export declare const getDayGrid: (options: IDayGridOptions) => IDay[][];
