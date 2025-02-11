import {
  quantile as d3Quantile,
  median as d3Median,
  mean as d3Mean,
} from 'd3-array';

// Boxplot data input props
export type CreateBoxplotProps = {
  data: { [key: string]: number[] };
  boundIQR: number;
};

// Boxplot data output props, which is compatible with eCharts boxplot series data
export type BoxplotDataProps = {
  // the boxData which will be rendred as boxplot by eCharts
  // [low, Q1, Q2, Q3, high]
  boxData: Array<{
    name: string;
    value: [number, number, number, number, number];
  }>;
  // the mean point, which will be rendred as a green point
  meanPoint: [string, number][];
  // the outliers, which will be rendred as red points, not used for now
  outlier?: [string, number][];
};

/**
 * Create a boxplot from a list of numbers and option boundIQR (1.5 or 3.0)
 */
export function createBoxplot({
  data,
  boundIQR,
}: CreateBoxplotProps): BoxplotDataProps {
  const meanPoint: [string, number][] = [];
  const visiblePoints: [string, number][] = [];

  // iterate through the data and calculate the boxplot data
  const boxData: BoxplotDataProps['boxData'] = Object.keys(data).map(
    (key: string) => {
      const values = data[key];
      const sortedData = values.sort((a, b) => a - b);
      const q1 = d3Quantile(sortedData, 0.25) || 0;
      const q3 = d3Quantile(sortedData, 0.75) || 0;
      const iqr = q3 - q1;
      const min = q1 - boundIQR * iqr;
      const max = q3 + boundIQR * iqr;
      const median = d3Median(sortedData) || 0;
      const mean = d3Mean(sortedData) || 0;
      // const outliers = sortedData.filter(d => d < min || d > max);
      const visible = sortedData.filter((d) => d >= q3 && d <= q1);
      visible.map((d: number) => visiblePoints.push([key, d]));
      meanPoint.push([key, mean]);

      return { name: key, value: [min, q1, median, q3, max] };
    }
  );

  return { boxData, meanPoint };
}
