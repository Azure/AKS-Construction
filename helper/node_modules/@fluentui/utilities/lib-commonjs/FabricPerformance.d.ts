/**
 * PerfData interface.
 *
 * @internal
 */
export interface IPerfData {
    duration: number;
    timeStamp: number;
}
/**
 * PerfMeasurement interface.
 *
 * @internal
 */
export interface IPerfMeasurement {
    totalDuration: number;
    count: number;
    all: IPerfData[];
}
/**
 * PerfSummary interface.
 *
 * @internal
 */
export interface IPerfSummary {
    [key: string]: IPerfMeasurement;
}
/**
 * Performance helper class for measuring things.
 *
 * @public
 * {@docCategory FabricPerformance}
 */
export declare class FabricPerformance {
    static summary: IPerfSummary;
    private static _timeoutId;
    /**
     * Measures execution time of the given syncronous function. If the same logic is executed multiple times,
     * each individual measurement will be collected as well the overall numbers.
     * @param name - The name of this measurement
     * @param func - The logic to be measured for execution time
     */
    static measure(name: string, func: () => void): void;
    static reset(): void;
    static setPeriodicReset(): void;
}
