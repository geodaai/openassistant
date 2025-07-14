// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { mean, standardDeviation } from 'simple-statistics';
import jStat from 'jstat';

/**
 * Standardize the data to have a mean of 0 and a standard deviation of 1.
 * @param data - The data to standardize.
 * @returns The standardized data.
 */
export function standardize(data: number[]): number[] {
  const meanValue = mean(data);
  const stdValue = standardDeviation(data);
  return data.map((value) => (value - meanValue) / stdValue);
}

export type SimpleLinearRegressionResult = {
  slope: number;
  intercept: number;
};

export function simpleLinearRegression(
  xData: number[],
  yData: number[]
): SimpleLinearRegressionResult {
  const n = xData.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += xData[i];
    sumY += yData[i];
    sumXY += xData[i] * yData[i];
    sumXX += xData[i] * xData[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

/**
 * The results of the linear regression.
 *
 * @param valid - Whether the regression is valid.
 * @param rSquared - The R-squared value.
 * @param intercept - The intercept of the regression.
 * @param interceptStandardError - The standard error of the intercept.
 * @param interceptTStat - The t-statistic of the intercept.
 * @param interceptPValue - The p-value of the intercept.
 * @param slope - The slope of the regression.
 * @param slopeStandardError - The standard error of the slope.
 * @param slopeTStat - The t-statistic of the slope.
 * @param slopePValue - The p-value of the slope.
 */
export type RegressionResults = {
  valid: boolean;
  rSquared: number;
  intercept: {
    estimate: number;
    standardError: number;
    tStatistic: number;
    pValue: number;
  };
  slope: {
    estimate: number;
    standardError: number;
    tStatistic: number;
    pValue: number;
  };
};

/**
 * Perform linear regression on the data.
 * @param x - The x data.
 * @param y - The y data.
 * @returns The results of the linear regression.
 */
export function linearRegression(x: number[], y: number[]): RegressionResults {
  if (x.length !== y.length || x.length < 2) {
    // Input arrays must have the same length and contain at least 2 points'
    // return zero regression results
    return {
      valid: false,
      rSquared: 0,
      intercept: { estimate: 0, standardError: 0, tStatistic: 0, pValue: 0 },
      slope: { estimate: 0, standardError: 0, tStatistic: 0, pValue: 0 },
    };
  }

  const n = x.length;

  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate sums of squares
  let xxSum = 0,
    xySum = 0,
    yySum = 0;
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    xxSum += xDiff * xDiff;
    xySum += xDiff * yDiff;
    yySum += yDiff * yDiff;
  }

  // Calculate slope and intercept
  const slope = xySum / xxSum;
  const intercept = yMean - slope * xMean;

  // Calculate predicted values and residuals
  const predicted = x.map((xi) => slope * xi + intercept);
  const residuals = y.map((yi, i) => yi - predicted[i]);

  // Calculate R-squared
  const totalSS = yySum;
  const residualSS = residuals.reduce((sum, r) => sum + r * r, 0);
  const rSquared = 1 - residualSS / totalSS;

  // Calculate standard errors and t-statistics
  const mse = residualSS / (n - 2); // Mean squared error
  const slopeStdError = Math.sqrt(mse / xxSum);
  const interceptStdError = Math.sqrt(mse * (1 / n + (xMean * xMean) / xxSum));

  const slopeTStat = slope / slopeStdError;
  const interceptTStat = intercept / interceptStdError;

  // Calculate p-values using t-distribution
  const slopePValue = 2 * (1 - tCDF(Math.abs(slopeTStat), n - 2));
  const interceptPValue = 2 * (1 - tCDF(Math.abs(interceptTStat), n - 2));

  return {
    valid: true,
    rSquared,
    intercept: {
      estimate: intercept,
      standardError: interceptStdError,
      tStatistic: interceptTStat,
      pValue: interceptPValue,
    },
    slope: {
      estimate: slope,
      standardError: slopeStdError,
      tStatistic: slopeTStat,
      pValue: slopePValue,
    },
  };
}

/**
 * Calculate the t-distribution CDF.
 * @param t - The t-value.
 * @param df - The degrees of freedom.
 * @returns The t-distribution CDF.
 */
function tCDF(t: number, df: number): number {
  // This is a simplified approximation of the t-distribution CDF
  // For more accurate results, you might want to use a statistical library
  const x = df / (df + t * t);
  return 1 - 0.5 * incompleteBeta(x, df / 2, 0.5);
}

/**
 * Helper function for incomplete beta function (simplified version).
 * @param x - The x value.
 * @param a - The a value.
 * @param b - The b value.
 * @returns The incomplete beta function.
 */
function incompleteBeta(x: number, a: number, b: number): number {
  // This is a very simplified version
  // For production use, consider using a statistical library
  const maxIterations = 100;
  let sum = 0;
  let term = 1;

  for (let i = 0; i < maxIterations; i++) {
    term *= ((a + i) * x) / (a + b + i);
    sum += term;
    if (Math.abs(term) < 1e-10) break;
  }

  return Math.pow(x, a) * sum;
}

/**
 * The results of the loess regression.
 *
 * @param fitted - The fitted values.
 * @param upper - The upper confidence interval.
 * @param lower - The lower confidence interval.
 */
export type LoessResult = {
  fitted: [number, number][];
  upper: [number, number][];
  lower: [number, number][];
};

/**
 * Calculate the loess regression.
 * @param xData - The x data.
 * @param yData - The y data.
 * @param bandwidth - The bandwidth.
 * @param steps - The number of steps.
 * @param confidenceLevel - The confidence level.
 * @returns The results of the loess regression. See {@link LoessResult} for more details.
 */
export function calculateLoessRegression(
  xData: number[],
  yData: number[],
  bandwidth = 0.2,
  steps = 100,
  confidenceLevel = 0.95
): LoessResult {
  const n = xData.length;
  const t = jStat.studentt.inv((1 + confidenceLevel) / 2, n - 2);

  // Sort x values and rearrange y accordingly
  const sorted = xData
    .map((x, i) => ({ x, y: yData[i] }))
    .sort((a, b) => a.x - b.x);
  const sortedX = sorted.map((p) => p.x);
  const sortedY = sorted.map((p) => p.y);

  const minX = Math.min(...xData);
  const maxX = Math.max(...xData);
  const span = maxX - minX;

  const fitted: [number, number][] = [];
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];

  for (let i = 0; i < steps; i++) {
    const x = minX + (span * i) / (steps - 1);
    let weightedSum = 0;
    let weightSum = 0;
    const weights: number[] = [];

    // Calculate weights and weighted sum
    for (let j = 0; j < n; j++) {
      const distance = Math.abs(x - sortedX[j]);
      const weight = Math.pow(
        1 - Math.pow(Math.min(1, distance / (bandwidth * span)), 3),
        3
      );
      weights.push(weight);
      weightedSum += weight * sortedY[j];
      weightSum += weight;
    }

    // Calculate fitted value
    const fittedValue = weightSum !== 0 ? weightedSum / weightSum : 0;

    // Calculate standard error for confidence interval
    let sumSquaredResiduals = 0;
    let sumSquaredWeights = 0;

    for (let j = 0; j < n; j++) {
      const residual = sortedY[j] - fittedValue;
      sumSquaredResiduals += weights[j] * residual * residual;
      sumSquaredWeights += weights[j] * weights[j];
    }

    const standardError = Math.sqrt(
      (sumSquaredResiduals / (n - 2)) *
        (1 / weightSum + sumSquaredWeights / (weightSum * weightSum))
    );

    const margin = t * standardError;

    fitted.push([x, fittedValue]);
    upper.push([x, fittedValue + margin]);
    lower.push([x, fittedValue - margin]);
  }

  return { fitted, upper, lower };
}

/**
 * Calculate the sum of squared residuals.
 * @param x - The x data.
 * @param y - The y data.
 * @returns The sum of squared residuals.
 */
function calculateSSR(x: number[], y: number[]): number {
  const n = x.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    ssr += Math.pow(y[i] - predicted, 2);
  }

  return ssr;
}

/**
 * Performs Chow test to check for structural break in linear regression
 * The fStat is the F-statistic and the pValue is the p-value.
 * If the pValue is less than 0.05, we can reject the null hypothesis and conclude that the regression is different between the first and second subset.
 * The larger the fStat, the more significant the difference between the two subsets.
 *
 * @param x1 First subset x values
 * @param y1 First subset y values
 * @param x2 Second subset x values
 * @param y2 Second subset y values
 * @returns Object containing F-statistic and p-value
 */
export type ChowTestResult = {
  fStat: number;
  pValue: number;
};

/**
 * Perform the Chow test to check if the regression is different between the first and second subset.
 *
 * @param x1 - The first subset x values.
 * @param y1 - The first subset y values.
 * @param x2 - The second subset x values.
 * @param y2 - The second subset y values.
 * @returns The results of the Chow test. See {@link ChowTestResult} for more details.
 */
export function chowTest(
  x1: number[],
  y1: number[],
  x2: number[],
  y2: number[]
): ChowTestResult {
  // Calculate SSR for pooled data
  const xPooled = [...x1, ...x2];
  const yPooled = [...y1, ...y2];
  const ssrPooled = calculateSSR(xPooled, yPooled);

  // Calculate SSR for each subset
  const ssr1 = calculateSSR(x1, y1);
  const ssr2 = calculateSSR(x2, y2);

  const n1 = x1.length;
  const n2 = x2.length;
  const k = 2; // number of parameters (slope and intercept)

  // Calculate F-statistic
  const numerator = (ssrPooled - (ssr1 + ssr2)) / k;
  const denominator = (ssr1 + ssr2) / (n1 + n2 - 2 * k);
  const fStat = numerator / denominator;

  // Calculate p-value using F-distribution
  const pValue = 1 - jStat.centralF.cdf(fStat, k, n1 + n2 - 2 * k);

  return { fStat, pValue };
}
