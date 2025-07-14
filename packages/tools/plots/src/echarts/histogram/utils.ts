// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

export type StringHistogramDataProps = {
  bin: number;
  binStart: string;
  binEnd: string;
};

export type NumericHistogramDataProps = {
  bin: number;
  binStart: number;
  binEnd: number;
};

export type HistogramDataProps =
  | NumericHistogramDataProps
  | StringHistogramDataProps;

/**
 * Create histogram bins.
 *
 * @param values - The values of the variable (can be numbers or strings).
 * @param numberOfBins - The number of bins to create (only used for numeric values).
 * @returns The histogram bins.
 * @throws Error if the number of unique string values exceeds 20
 */
export function createHistogramBins(
  values: Array<number | string>,
  numberOfBins: number = 5
): {
  counts: number[];
  indices: number[][];
  breaks: number[];
  histogramData: HistogramDataProps[];
  barDataIndexes: number[][];
} {
  if (!values.length) {
    return {
      counts: [],
      indices: [],
      breaks: [],
      histogramData: [],
      barDataIndexes: [],
    };
  }

  // Check if all values are strings
  const isStringArray = values.some(
    (value) => value !== undefined && typeof value === 'string'
  );

  if (isStringArray) {
    // Use Map to track unique string values and their counts
    const valueMap = new Map<string, { count: number; indices: number[] }>();

    values.forEach((value, index) => {
      if (typeof value !== 'string') return;
      const entry = valueMap.get(value);
      if (entry) {
        entry.count++;
        entry.indices.push(index);
      } else {
        valueMap.set(value, { count: 1, indices: [index] });
      }
    });

    // Convert Map entries to sorted array
    const sortedBins = Array.from(valueMap.entries())
      .map(([value, { count, indices }]) => ({
        value,
        count,
        indices,
      }))
      .sort((a, b) => b.count - a.count);

    // If there are more than 10 bins, combine the smaller ones into "Others"
    const MAX_UNIQUE_VALUES = 10;
    const hasOthers = sortedBins.length > MAX_UNIQUE_VALUES;
    const displayBins = hasOthers
      ? [
          ...sortedBins.slice(0, MAX_UNIQUE_VALUES),
          {
            value: 'Others',
            count: sortedBins
              .slice(MAX_UNIQUE_VALUES)
              .reduce((sum, bin) => sum + bin.count, 0),
            indices: sortedBins
              .slice(MAX_UNIQUE_VALUES)
              .flatMap((bin) => bin.indices),
          },
        ]
      : sortedBins;

    // Create final arrays
    const counts = displayBins.map((bin) => bin.count);
    const indices = displayBins.map((bin) => bin.indices);
    const histogramData: StringHistogramDataProps[] = displayBins.map(
      (bin, index) => ({
        bin: index,
        binStart: bin.value,
        binEnd: bin.value,
      })
    );

    return {
      counts,
      indices,
      breaks: [], // No numeric breaks for string values
      histogramData,
      barDataIndexes: indices,
    };
  }

  // Convert string values to numbers and filter out invalid values
  const numericValues = values
    .map((value) => {
      if (typeof value === 'number') return value;
      const num = Number(value);
      return isNaN(num) ? null : num;
    })
    .filter((value): value is number => value !== null);

  if (numericValues.length === 0) {
    return {
      counts: [],
      indices: [],
      breaks: [],
      histogramData: [],
      barDataIndexes: [],
    };
  }

  // Find min and max values
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);

  // Calculate bin width
  const binWidth = (max - min) / numberOfBins;

  // Create breaks array
  const breaks = Array.from(
    { length: numberOfBins + 1 },
    (_, i) => min + i * binWidth
  );

  // Initialize arrays
  const counts = new Array(numberOfBins).fill(0);
  const indices = Array.from({ length: numberOfBins }, () => [] as number[]);
  const histogramData: NumericHistogramDataProps[] = [];

  // Create histogram data structure
  for (let i = 0; i < numberOfBins; i++) {
    histogramData.push({
      bin: i,
      binStart: breaks[i],
      binEnd: breaks[i + 1],
    });
  }

  // Count values and store indices in each bin
  values.forEach((value, index) => {
    const numValue = typeof value === 'number' ? value : Number(value);
    if (isNaN(numValue)) return; // Skip invalid values

    // Handle edge case for maximum value
    if (numValue === max) {
      counts[numberOfBins - 1]++;
      indices[numberOfBins - 1].push(index);
      return;
    }

    const binIndex = Math.floor((numValue - min) / binWidth);
    counts[binIndex]++;
    indices[binIndex].push(index);
  });

  return {
    counts,
    indices,
    breaks,
    histogramData,
    barDataIndexes: indices,
  };
}
