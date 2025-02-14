/**
 * Represents the properties for Parallel Coordinates Plot (PCP) data.
 * Each element in the array describes a dimension/axis of the PCP.
 */
export type ParallelCoordinateDataProps = Array<{
  /** The name of the dimension/axis */
  name: string;
  /** The minimum value in this dimension */
  min: number;
  /** The maximum value in this dimension */
  max: number;
  /** The mean (average) value in this dimension */
  mean: number;
  /** The standard deviation of values in this dimension */
  std: number;
}>;
