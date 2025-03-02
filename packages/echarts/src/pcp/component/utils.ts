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

type RawDataType = Record<string, number[]>;

/**
 * Processes variable data to calculate statistics and prepare PCP data structure
 * @param values Array of numeric values for a variable
 * @param variableName Name of the variable
 * @returns Object containing statistical measures
 */
function calculateVariableStats(values: number[], variableName: string) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const std = Math.sqrt(
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      (values.length - 1)
  );

  return { name: variableName, min, max, mean, std };
}

/**
 * Processes multiple variables to generate PCP data and raw data
 * @param rawData Object containing variable names as keys and their corresponding numeric values as arrays
 * @returns Processed PCP data with statistical measures for each variable
 */
export function processParallelCoordinateData(
  rawData: RawDataType
): ParallelCoordinateDataProps {
  const pcp: ParallelCoordinateDataProps = [];

  Object.entries(rawData).forEach(([variable, values]) => {
    const stats = calculateVariableStats(values, variable);
    pcp.push(stats);
  });

  return pcp;
}
