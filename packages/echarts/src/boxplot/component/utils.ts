import {
  quantile as d3Quantile,
  median as d3Median,
  mean as d3Mean,
  deviation as d3StandardDeviation,
} from 'd3-array';

// Boxplot data input props
export type CreateBoxplotProps = {
  data: { [key: string]: number[] };
  boundIQR: number;
};

export type BoxplotProps = {
  name: string;
  low: number;
  q1: number;
  q2: number;
  q3: number;
  high: number;
  mean: number;
  std: number;
  iqr: number;
};

// Boxplot data output props, which is compatible with eCharts boxplot series data
export type BoxplotDataProps = {
  // the boxData which will be rendred as boxplot by eCharts
  boxplots: Array<BoxplotProps>;
  // the mean point, which will be rendred as a green point
  meanPoint: [string, number][];
};

/**
 * Create a boxplot from a list of numbers and option boundIQR (1.5 or 3.0)
 */
export function createBoxplot({
  data,
  boundIQR,
}: CreateBoxplotProps): BoxplotDataProps {
  const meanPoint: [string, number][] = [];

  // iterate through the data and calculate the boxplot data
  const boxplots: BoxplotProps[] = Object.keys(data).map((key: string) => {
    const values = data[key];
    const sortedData = values.sort((a, b) => a - b);
    const q1 = d3Quantile(sortedData, 0.25) || 0;
    const q3 = d3Quantile(sortedData, 0.75) || 0;
    const iqr = q3 - q1;
    const min = q1 - boundIQR * iqr;
    const max = q3 + boundIQR * iqr;
    const median = d3Median(sortedData) || 0;
    const mean = d3Mean(sortedData) || 0;
    const std = d3StandardDeviation(sortedData) || 0;
    meanPoint.push([key, mean]);

    return {
      name: key,
      low: min,
      q1,
      q2: median,
      q3,
      high: max,
      mean,
      std,
      iqr,
    };
  });

  return { boxplots, meanPoint };
}
