import { HistogramDataProps } from './histogram-option';

/**
 * Create histogram bins.
 *
 * @param values - The values of the variable.
 * @param numberOfBins - The number of bins to create.
 * @returns The histogram bins.
 */
export function createHistogramBins(
  values: number[],
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

  // Find min and max values
  const min = Math.min(...values);
  const max = Math.max(...values);

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
  const histogramData: HistogramDataProps[] = [];

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
    // Handle edge case for maximum value
    if (value === max) {
      counts[numberOfBins - 1]++;
      indices[numberOfBins - 1].push(index);
      return;
    }

    const binIndex = Math.floor((value - min) / binWidth);
    counts[binIndex]++;
    indices[binIndex].push(index);
  });

  return {
    counts,
    indices,
    breaks,
    histogramData,
    barDataIndexes: indices, // reuse indices array for barDataIndexes
  };
}
