import { DATA_TYPES as AnalyzerDATA_TYPES } from 'type-analyzer';
import * as arrow from 'apache-arrow';

// import { ALL_FIELD_TYPES } from '@kepler.gl/constants';
declare const ALL_FIELD_TYPES: {
  boolean: 'boolean';
  date: 'date';
  geojson: 'geojson';
  integer: 'integer';
  real: 'real';
  string: 'string';
  timestamp: 'timestamp';
  point: 'point';
  array: 'array';
  object: 'object';
  geoarrow: 'geoarrow';
};

// import { Field } from '@kepler.gl/types';
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
