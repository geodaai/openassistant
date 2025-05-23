import {
  LinearRegressionResult,
  SpatialErrorResult,
  SpatialLagResult,
  linearRegression,
  spatialLagRegression,
  spatialError,
  printLinearRegressionResultUsingMarkdown,
  printSpatialLagResultUsingMarkdown,
  printSpatialErrorResultUsingMarkdown,
} from '@geoda/regression';

import { WeightsProps } from '../types';

export type RegressionDataProps = {
  dependentVariable: string;
  independentVariables: string[];
  weights?: string;
  dependentVariableData?: number[];
  independentVariablesData?: number[][];
  modelType?: string;
  datasetName?: string;
  result: LinearRegressionResult | SpatialLagResult | SpatialErrorResult | null;
};

export type RunRegressionProps = {
  datasetName: string;
  model: string;
  y: number[];
  yName: string;
  x: number[][];
  xNames: string[];
  weights?: WeightsProps;
};

export async function runRegression({
  model,
  y,
  x,
  yName,
  xNames,
  weights,
  datasetName,
}: RunRegressionProps): Promise<RegressionDataProps> {
  let result:
    | LinearRegressionResult
    | SpatialLagResult
    | SpatialErrorResult
    | null = null;

  // get weights data
  const weightsId = weights?.weightsMeta.id;
  const w = weights?.weights;

  if (model === 'classic') {
    result = await linearRegression({
      x,
      y,
      xNames,
      yName,
      weightsId,
      weights: w,
      datasetName,
    });
  } else if (model === 'spatial-lag') {
    result = await spatialLagRegression({
      x,
      y,
      xNames,
      yName,
      weightsId,
      weights: w,
      datasetName,
    });
  } else if (model === 'spatial-error') {
    result = await spatialError({
      x,
      y,
      xNames,
      yName,
      weightsId,
      weights: w,
      datasetName,
    });
  } else {
    throw new Error(`Invalid regression model: ${model}`);
  }

  return {
    dependentVariable: yName,
    independentVariables: xNames,
    weights: weightsId,
    result,
  };
}

// check if the type of regressionReport is LinearRegressionResult
export function isLinearRegressionResult(
  regressionReport:
    | LinearRegressionResult
    | SpatialLagResult
    | SpatialErrorResult
    | null
): regressionReport is LinearRegressionResult {
  return regressionReport?.type === 'linearRegression';
}

// check if the type of regressionReport is SpatialLagResult
export function isSpatialLagResult(
  regressionReport:
    | LinearRegressionResult
    | SpatialLagResult
    | SpatialErrorResult
    | null
): regressionReport is SpatialLagResult {
  return regressionReport?.type === 'spatialLag';
}

// check if the type of regressionReport is SpatialErrorResult
export function isSpatialErrorResult(
  regressionReport:
    | LinearRegressionResult
    | SpatialLagResult
    | SpatialErrorResult
    | null
): regressionReport is SpatialErrorResult {
  return regressionReport?.type === 'spatialError';
}

export const printRegressionResult = (
  report: LinearRegressionResult | SpatialLagResult | SpatialErrorResult | null
) => {
  if (isLinearRegressionResult(report)) {
    return printLinearRegressionResultUsingMarkdown(report);
  } else if (isSpatialLagResult(report)) {
    return printSpatialLagResultUsingMarkdown(report);
  } else if (isSpatialErrorResult(report)) {
    return printSpatialErrorResultUsingMarkdown(report);
  }
  return 'Error: Unknown regression type.';
};
