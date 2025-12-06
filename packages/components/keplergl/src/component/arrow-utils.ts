// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { DATA_TYPES as AnalyzerDATA_TYPES } from 'type-analyzer';
import * as arrow from 'apache-arrow';
import { vectorFromArray } from 'apache-arrow/factories';

// Replicate ALL_FIELD_TYPES from @kepler.gl/constants to avoid importing the entire package
const ALL_FIELD_TYPES = {
  boolean: 'boolean',
  date: 'date',
  geojson: 'geojson',
  integer: 'integer',
  real: 'real',
  string: 'string',
  timestamp: 'timestamp',
  point: 'point',
  array: 'array',
  object: 'object',
  geoarrow: 'geoarrow',
} as const;

type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  displayName: string;
  format: string;
  type: string;
  fieldIdx: number;
  valueAccessor(v: { index: number }): unknown;
  filterProps?: unknown;
  metadata?: unknown;
  displayFormat?: string;
};

export function arrowDataTypeToFieldType(arrowType: arrow.DataType): string {
  if (arrow.DataType.isDate(arrowType)) {
    return ALL_FIELD_TYPES.date;
  } else if (
    arrow.DataType.isTimestamp(arrowType) ||
    arrow.DataType.isTime(arrowType)
  ) {
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

export function arrowDataTypeToAnalyzerDataType(
  arrowType: arrow.DataType
): typeof AnalyzerDATA_TYPES {
  if (arrow.DataType.isDate(arrowType)) {
    return AnalyzerDATA_TYPES.DATE;
  } else if (
    arrow.DataType.isTimestamp(arrowType) ||
    arrow.DataType.isTime(arrowType)
  ) {
    return AnalyzerDATA_TYPES.DATETIME;
  } else if (arrow.DataType.isFloat(arrowType)) {
    return AnalyzerDATA_TYPES.FLOAT;
  } else if (arrow.DataType.isInt(arrowType)) {
    return AnalyzerDATA_TYPES.INT;
  } else if (arrow.DataType.isBool(arrowType)) {
    return AnalyzerDATA_TYPES.BOOLEAN;
  } else if (
    arrow.DataType.isUtf8(arrowType) ||
    arrow.DataType.isNull(arrowType)
  ) {
    return AnalyzerDATA_TYPES.STRING;
  } else if (
    arrow.DataType.isBinary(arrowType) ||
    arrow.DataType.isDictionary(arrowType) ||
    arrow.DataType.isFixedSizeBinary(arrowType) ||
    arrow.DataType.isFixedSizeList(arrowType) ||
    arrow.DataType.isList(arrowType) ||
    arrow.DataType.isMap(arrowType) ||
    arrow.DataType.isStruct(arrowType)
  ) {
    return AnalyzerDATA_TYPES.OBJECT;
  }
  console.warn(`Unsupported arrow type: ${arrowType}`);
  return AnalyzerDATA_TYPES.STRING;
}

/**
 * Check if the value is an Arrow Table
 */
export function isArrowTable(value: unknown): value is arrow.Table {
  return value instanceof arrow.Table;
}

/**
 * Convert an Arrow-like table to row objects (fallback for non-Arrow data)
 */
export function arrowTableToRows(
  arrowTable: arrow.Table
): Record<string, unknown>[] {
  return arrowTable.toArray().map((row) => {
    if (typeof row.toJSON === 'function') {
      return row.toJSON();
    }
    return row as unknown as Record<string, unknown>;
  });
}

/**
 * Create a kepler.gl compatible Arrow dataset
 * Pass the Arrow table directly for native Arrow support
 */
export function createKeplerArrowDataset(
  arrowTable: arrow.Table,
  datasetName: string
): {
  data: {
    fields: Field[];
    rows: never[];
    cols: (arrow.Vector | null)[];
  };
  info: {
    id: string;
    label: string;
    format: 'arrow';
  };
} {
  const fields = arrowSchemaToFields(arrowTable.schema);

  // Normalize columns to Vectors created by this apache-arrow instance.
  // This avoids issues when upstream data was created by a different
  // copy of the Arrow library (which breaks instanceof/Data checks
  // inside kepler.gl's ArrowDataContainer / Vector constructors).
  const cols = arrowTable.schema.fields.map((field, index) => {
    const originalCol = arrowTable.getChildAt(index);
    if (!originalCol) {
      return null;
    }

    // Rebuild the column as a new Vector from plain values
    // using the current apache-arrow module.
    const values = originalCol.toArray();
    return vectorFromArray(values, field.type) as arrow.Vector;
  });

  return {
    data: {
      fields,
      rows: [],
      cols,
    },
    info: {
      id: datasetName,
      label: datasetName,
      format: 'arrow',
    },
  };
}

