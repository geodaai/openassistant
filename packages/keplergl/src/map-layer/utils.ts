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
