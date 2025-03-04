'use client';

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
import { ALL_FIELD_TYPES } from '@kepler.gl/constants';
import { arrowDataTypeToAnalyzerDataType } from '@kepler.gl/utils';
import { Field } from '@kepler.gl/types';
import * as arrow from 'apache-arrow';

export function arrowDataTypeToFieldType(arrowType: arrow.DataType): string {
  // Note: this function doesn't return ALL_FIELD_TYPES.geojson or ALL_FIELD_TYPES.array, which
  // should be further detected by caller
  if (arrow.DataType.isDate(arrowType)) {
    return ALL_FIELD_TYPES.date;
  } else if (
    arrow.DataType.isTimestamp(arrowType) ||
    arrow.DataType.isTime(arrowType)
  ) {
    // return ALL_FIELD_TYPES.timestamp;
    return ALL_FIELD_TYPES.string;
  } else if (arrow.DataType.isFloat(arrowType)) {
    return ALL_FIELD_TYPES.real;
  } else if (arrow.DataType.isInt(arrowType)) {
    return ALL_FIELD_TYPES.integer;
  } else if (arrow.DataType.isBool(arrowType)) {
    return ALL_FIELD_TYPES.boolean;
  } else if (
    arrow.DataType.isUtf8(arrowType) ||
    arrow.DataType.isNull(arrowType)
  ) {
    return ALL_FIELD_TYPES.string;
  } else if (
    arrow.DataType.isBinary(arrowType) ||
    arrow.DataType.isDictionary(arrowType) ||
    arrow.DataType.isFixedSizeBinary(arrowType) ||
    arrow.DataType.isFixedSizeList(arrowType) ||
    arrow.DataType.isList(arrowType) ||
    arrow.DataType.isMap(arrowType) ||
    arrow.DataType.isStruct(arrowType)
  ) {
    return ALL_FIELD_TYPES.object;
  }
  console.error(`Unsupported arrow type: ${arrowType}`);
  return ALL_FIELD_TYPES.string;
}

export function arrowSchemaToFields(schema: arrow.Schema): Field[] {
  return schema.fields.map((field: arrow.Field, index: number) => {
    const isGeoArrowColumn = field.metadata
      .get('ARROW:extension:name')
      ?.startsWith('geoarrow');
    return {
      ...field,
      name: field.name,
      id: field.name,
      displayName: field.name,
      format: '',
      fieldIdx: index,
      type: isGeoArrowColumn
        ? ALL_FIELD_TYPES.geoarrow
        : arrowDataTypeToFieldType(field.type),
      analyzerType: isGeoArrowColumn
        ? 'GEOMETRY'
        : arrowDataTypeToAnalyzerDataType(field.type),
      valueAccessor: (dc) => (d) => {
        // @ts-expect-error FIX type
        return dc.valueAt(d.index, index);
      },
      metadata: field.metadata,
    };
  });
}

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
}: CallbackFunctionProps): Promise<CustomFunctionOutputProps<CreateMapOutputResult, CreateMapOutputData>> {
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

    const dataContent = await getDataset({ datasetName });

    let datasetForKepler: FileCacheItem[] = [];

    // check if dataContent is an Arrow Table
    if (dataContent instanceof arrow.Table) {
      const fields = arrowSchemaToFields(dataContent.schema);

      const cols = [...Array(dataContent.numCols).keys()].map((i) =>
        dataContent.getChildAt(i)
      );

      const result = {
        fields,
        rows: [],
        cols,
        metadata: dataContent.schema.metadata,
      };

      // return empty rows and use raw arrow table to construct column-wise data container
      datasetForKepler = [
        {
          data: result,
          info: {
            id: datasetName,
            label: datasetName,
            format: 'arrow',
          },
        },
      ];
    } else {
      // convert dataContent to ProcessFileDataContent for kepler.gl
      const processDataContent: ProcessFileDataContent = {
        data: dataContent,
        fileName: datasetName,
      };

      datasetForKepler = await processFileData({
        content: processDataContent,
        fileCache: [],
      });
    }

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
