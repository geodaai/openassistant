import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { CreateMapOutputData } from './callback-component';
import { MapLayerFunctionContext } from './definition';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
} from '@kepler.gl/processors';

type CreateMapLayerFunctionArgs = {
  datasetName: string;
  geometryColumn?: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  mapType?: string;
};

function isMapLayerFunctionArgs(
  data: unknown
): data is CreateMapLayerFunctionArgs {
  return typeof data === 'object' && data !== null && 'datasetName' in data;
}

function isMapLayerFunctionContext(
  context: unknown
): context is MapLayerFunctionContext {
  return (
    typeof context === 'object' && context !== null && 'getDataset' in context
  );
}

type CreateMapOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      datasetName: string;
      fields: string;
      details: string;
    };

export async function CreateMapCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<CreateMapOutputResult, CreateMapOutputData>
> {
  // check if the function arguments are valid
  if (!isMapLayerFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid function arguments.',
      },
    };
  }

  const { datasetName } = functionArgs;

  // check if the function context is valid
  if (!isMapLayerFunctionContext(functionContext)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid function context.',
      },
    };
  }

  try {
    // get the dataset from the function context
    const { getDataset, config } = functionContext;

    const dataContent = getDataset({ datasetName });

    // convert dataContent to ProcessFileDataContent for kepler.gl
    const processDataContent: ProcessFileDataContent = {
      data: dataContent,
      fileName: datasetName,
    };

    const datasetForKepler: FileCacheItem[] = await processFileData({
      content: processDataContent,
      fileCache: [],
    });

    if (!datasetForKepler || datasetForKepler.length === 0) {
      throw new Error('Dataset not not processed correctly.');
    }

    // get fields from the dataset
    const fields = datasetForKepler[0].data.fields;

    return {
      type: 'success',
      name: functionName,
      result: {
        success: true,
        datasetName,
        fields: JSON.stringify(fields),
        details: 'Map created successfully.',
      },
      data: {
        datasetName,
        datasetForKepler,
        isDraggable: Boolean(config?.isDraggable),
      },
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
