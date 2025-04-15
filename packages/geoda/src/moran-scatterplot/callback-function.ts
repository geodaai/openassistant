import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { initGeoDa, spatialLag, WeightsMeta } from 'geoda-wasm';
import { simpleLinearRegression } from '@openassistant/echarts';
import { MoranScatterOutputData } from './component/moran-scatter-plot';
import {
  isMoranScatterPlotArgs,
  isWeightsOutputData,
  MoranScatterPlotFunctionContext,
} from './tool';

type MoranScatterOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      variableName: string;
      weightsId: string;
      globalMoranI: number;
      details: string;
    };

export type SpatialWeights = {
  weights: number[][];
  weightsMeta: WeightsMeta;
};

/**
 * @internal
 * @deprecated Use {@link moranScatterPlot} tool instead
 */
export async function moranScatterCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
  previousOutput,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<MoranScatterOutputResult, MoranScatterOutputData>
> {
  if (!isMoranScatterPlotArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid moran scatter plot function arguments.',
      },
    };
  }

  const { datasetName, variableName, weightsId } = functionArgs;

  if (!datasetName || !variableName || !weightsId) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Dataset name, variable name and weightsId are required.',
      },
    };
  }

  let weights: number[][] | null = null;
  let weightsMeta: WeightsMeta | null = null;

  // check if weightsId can be retrived from previousOutput
  previousOutput?.forEach((output) => {
    if (isWeightsOutputData(output.data)) {
      if (output.data.weightsMeta.id === weightsId) {
        weights = output.data.weights;
        weightsMeta = output.data.weightsMeta;
      }
    }
  });

  const { getValues, getWeights, config } =
    functionContext as MoranScatterPlotFunctionContext;

  if (!weights && getWeights) {
    // try to call getWeights to find from existing weights
    const weightsResult = getWeights(weightsId);
    weights = weightsResult.weights;
    weightsMeta = weightsResult.weightsMeta;
  }

  if (!weights || !weightsMeta) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Error: Weights can not be created for moran scatter plot.',
      },
    };
  }

  let values: number[] = [];

  try {
    values = await getValues(datasetName, variableName);
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to get values from dataset. ${error}`,
      },
    };
  }

  try {
    // compute moran's I
    await initGeoDa();
    const lagValues = await spatialLag(values, weights);
    const regression = simpleLinearRegression(values, lagValues);
    const slope = regression.slope;

    return {
      type: 'plot',
      name: functionName,
      result: {
        success: true,
        variableName,
        details: `Global Moran's I is ${slope} for ${variableName} with ${weightsMeta.type} weights ${weightsId}.`,
      },
      data: {
        datasetName,
        variableName,
        weights,
        weightsMeta,
        values,
        lagValues,
        regression,
        theme: config?.theme || 'dark',
        isDraggable: Boolean(config?.isDraggable),
      },
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to create moran scatter plot. ${error}`,
      },
    };
  }
}
