// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  chowTest,
  ChowTestResult,
  linearRegression,
  RegressionResults,
} from '../math/linear-regression';

/**
 * The properties of the regression.
 * @internal
 * @param xData - The x data. The array of x values.
 * @param yData - The y data. The array of y values.
 * @param filteredIndex - The indices of the selected points. The array of indices of the selected points.
 */
export type ComputeRegressionProps = {
  xData: number[];
  yData: number[];
  filteredIndex?: number[];
};

/**
 * The results of the regression.
 * @internal
 * @param regression - The regression results.
 * @param regressionSelected - The regression results for the selected points.
 * @param regressionUnselected - The regression results for the unselected points.
 * @param chowResults - The results of the Chow test. See {@link ChowTestResult} for more details.
 */
export type ComputeRegressionResult = {
  regression: RegressionResults;
  regressionSelected?: RegressionResults;
  regressionUnselected?: RegressionResults;
  chowResults?: ChowTestResult;
};

/**
 * Compute the regression for the scatterplot. If filteredIndex is provided, compute the regression for the selected points and the unselected points.
 * Otherwise, only the regression for all points is computed.
 *
 * @internal
 * @param props - The properties for computing regression
 * @param props.xData - The x data
 * @param props.yData - The y data
 * @param props.filteredIndex - The indices of the selected points
 * @returns The results of the regression. See {@link ComputeRegressionResult} for more details.
 */
export function computeRegression({
  xData,
  yData,
  filteredIndex,
}: ComputeRegressionProps): ComputeRegressionResult {
  const regression = linearRegression(xData, yData);

  // If filteredIndex is provided, compute the regression for the selected points and the unselected points
  if (filteredIndex && filteredIndex.length > 0) {
    const selected = new Set(filteredIndex);
    const selectedX: number[] = [];
    const selectedY: number[] = [];
    const unselectedX: number[] = [];
    const unselectedY: number[] = [];

    xData.forEach((x, i) => {
      if (selected.has(i)) {
        selectedX.push(x);
        selectedY.push(yData[i]);
      } else {
        unselectedX.push(x);
        unselectedY.push(yData[i]);
      }
    });

    const regressionSelected = linearRegression(selectedX, selectedY);
    const regressionUnselected = linearRegression(unselectedX, unselectedY);

    // run Chow test to check if the regression is different between the selected and unselected points
    const chowResults = chowTest(
      selectedX,
      selectedY,
      unselectedX,
      unselectedY
    );

    return {
      regression,
      regressionSelected,
      regressionUnselected,
      chowResults,
    };
  }

  return {
    regression,
  };
}
