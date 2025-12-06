import { StoreApi } from '@sqlrooms/room-shell';
import { AiSliceState } from '@sqlrooms/ai-core';
import { DuckDbSliceState } from '@sqlrooms/duckdb';
import { KeplerSliceState } from '@sqlrooms/kepler';
import { MutableRefObject } from 'react';
import { z } from 'zod';

// kepler.gl imports
import KeplerTable, { Datasets } from '@kepler.gl/table';
import { LayerClasses } from '@kepler.gl/layers';
import { findDefaultLayer } from '@kepler.gl/reducers';
import { generateId } from '@openassistant/utils';
import { ResizableKeplerMapContainer } from './mapToolComponent';

export function guessDefaultLayer(dataset: KeplerTable, layerType: string) {
  // Hexagon: try to use field pairs
  if (layerType === 'hexagon') {
    if (dataset.fieldPairs && dataset.fieldPairs.length > 0) {
      const props = dataset.fieldPairs.map((fieldPair) => ({
        isVisible: true,
        label: 'Hexbin',
        columns: fieldPair.pair,
      }));
      const layer = new LayerClasses.hexagon(props[0]);
      return layer as any;
    }
  } else if (layerType === 'hexagonId') {
    // H3: try to use hexIdColumn
    if (
      'hexIdColumn' in dataset &&
      typeof dataset.hexIdColumn === 'string' &&
      'hexIdColumnFieldIdx' in dataset &&
      typeof dataset.hexIdColumnFieldIdx === 'number'
    ) {
      const props = {
        isVisible: true,
        label: 'H3',
        columns: {
          hex_id: {
            value: dataset.hexIdColumn,
            fieldIdx: dataset.hexIdColumnFieldIdx,
          },
        },
      };
      const layer = new LayerClasses.hexagonId(props);
      return layer;
    }
  }
  const defaultLayers = findDefaultLayer(dataset, LayerClasses as any);
  const layer = defaultLayers.find(
    (l) =>
      l.type === layerType || (layerType === 'h3' && l.type === 'hexagonId')
  );
  return layer || (defaultLayers.length > 0 ? defaultLayers[0] : null);
}

/**
 * Creates a getDataset function that fetches Arrow data from DuckDB.
 */
function createGetDatasetFunction(storeRef: MutableRefObject<any>) {
  return async (tableName: string) => {
    if (!storeRef.current) {
      throw new Error('Store is not yet initialized');
    }
    const store: StoreApi<AiSliceState & DuckDbSliceState> = storeRef.current;
    // Get the dataset from the duckdb table as Arrow table
    const connector = await store.getState().db.getConnector();
    const arrowTable = await connector.query(`SELECT * FROM ${tableName}`);
    return arrowTable;
  };
}

export const AddMapLayerParameters = z.object({
  tableName: z
    .string()
    .describe('The name of the table in DuckDB used to create the layer.'),
  latitudeColumn: z.string().optional(),
  longitudeColumn: z.string().optional(),
  hexIdColumn: z.string().optional(),
  layerName: z
    .string()
    .optional()
    .describe('Generate a unique name for the layer based on the context.'),
  layerType: z.enum([
    'point',
    'arc',
    'line',
    'grid',
    'hexagon',
    'geojson',
    'cluster',
    'heatmap',
    'h3',
    'trip',
    's2',
  ]),
  colorBy: z.string().optional(),
  colorType: z.enum(['breaks', 'unique']).optional(),
  colorMap: z
    .array(
      z.object({
        value: z.union([z.string(), z.number(), z.null()]),
        color: z.string(),
      })
    )
    .optional(),
});
export type AddMapLayerParameters = z.infer<typeof AddMapLayerParameters>;

/**
 * Creates a lazy map tool that defers store initialization.
 * This is useful when the store is not available at the time of tool creation.
 *
 * The tool uses lazy loading for Arrow data - instead of serializing the Arrow table
 * (which causes issues with Kepler.gl's `.get()` method), the component fetches
 * the data directly from DuckDB when it mounts.
 *
 * @param storeRef - A React ref that will eventually contain the roomStore
 * @returns A tool configuration object for the lazy map tool
 */
export function createLazyMapTool(storeRef: MutableRefObject<any>) {
  return {
    name: 'createMapLayer',
    description: `Create a kepler.gl map layer from a table.
IMPORTANT: if generate layer name, it has to be unique.

When creating a basic map:
- Use tableName, geometryColumn, latitudeColumn/longitudeColumn (for point map), hexIdColumn (for h3 map), and layerType
- Omit color-related parameters for simple map visualization

When creating a colored map:
- If user requests color visualization, use available numeric columns in the table
- Use dataClassify tool to classify data into bins or unique values when needed
- Generate colorBrewer colors automatically if user doesn't specify colors
- For colorType 'breaks': [{value: 3, color: '#f7fcb9'}, {value: 10, color: '#addd8e'}, {value: null, color: '#31a354'}]
- For colorType 'unique': [{value: 'a', color: '#f7fcb9'}, {value: 'b', color: '#addd8e'}, {value: 'c', color: '#31a354'}]
`,
    parameters: AddMapLayerParameters as z.ZodTypeAny,
    context: {
      getDataset: createGetDatasetFunction(storeRef),
    },
    execute: async (
      args: AddMapLayerParameters,
      options?: { abortSignal?: AbortSignal; context?: { getDataset: any } }
    ) => {
      if (!storeRef.current) {
        throw new Error('Store is not yet initialized');
      }

      const abortSignal = options?.abortSignal;

      try {
        // Check if aborted before starting
        if (abortSignal?.aborted) {
          throw new Error('Operation was aborted');
        }

        const {
          tableName,
          layerName,
          latitudeColumn,
          longitudeColumn,
          hexIdColumn,
          layerType,
          colorBy,
          colorType,
          colorMap = [{ value: null, color: '#333333' }],
        } = args;

        // Resolve store lazily so it is available when the tool is executed
        const store: StoreApi<
          AiSliceState & DuckDbSliceState & KeplerSliceState
        > = storeRef.current;

        const state = store.getState();
        const currentMapId = state.kepler.getCurrentMap()?.id || '';
        const map = state.kepler.map[currentMapId];
        const datasets = map?.visState?.datasets as Datasets | undefined;
        if (!datasets) {
          throw new Error('No datasets found in current map.');
        }

        // Locate datasetId by label or id matching tableName
        const datasetId = Object.keys(datasets).find(
          (id) => datasets[id]?.label === tableName || id === tableName
        );
        if (!datasetId) {
          throw new Error(`Dataset for table ${tableName} not found.`);
        }

        const dataset = datasets[datasetId];

        // Guess default layer or construct point layer with provided lat/lng
        let layer = guessDefaultLayer(dataset as KeplerTable, layerType);
        const layerId = layer?.id || `layer_${generateId()}`;

        if (!layer) {
          if (layerType === 'point' && latitudeColumn && longitudeColumn) {
            layer = {
              id: layerId,
              type: 'point',
              config: {
                dataId: datasetId,
                label: layerName || `${tableName}-${layerType}`,
                columns: {
                  lat: {
                    value: latitudeColumn,
                    fieldIdx: (dataset as KeplerTable).getColumnFieldIdx(
                      latitudeColumn
                    ),
                  },
                  lng: {
                    value: longitudeColumn,
                    fieldIdx: (dataset as KeplerTable).getColumnFieldIdx(
                      longitudeColumn
                    ),
                  },
                },
              },
              visConfig: {
                colorRange: {
                  name: 'Ice And Fire',
                  type: 'diverging',
                  category: 'Uber',
                  colors: [
                    '#D50255',
                    '#FEAD54',
                    '#FEEDB1',
                    '#E8FEB5',
                    '#49E3CE',
                    '#0198BD',
                  ],
                },
                strokeColorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: [
                    '#5A1846',
                    '#900C3F',
                    '#C70039',
                    '#E3611C',
                    '#F1920E',
                    '#FFC300',
                  ],
                },
              },
            };
          } else if (layerType === 'h3' && hexIdColumn) {
            layer = {
              id: layerId,
              type: 'hexagonId',
              config: {
                dataId: datasetId,
                label: layerName || `${tableName}-${layerType}`,
                // for H3, kepler expects column name mapping; it will resolve fieldIdx internally
                columns: { hex_id: hexIdColumn },
              },
              visConfig: {
                colorRange: {
                  name: 'Ice And Fire',
                  type: 'diverging',
                  category: 'Uber',
                  colors: [
                    '#D50255',
                    '#FEAD54',
                    '#FEEDB1',
                    '#E8FEB5',
                    '#49E3CE',
                    '#0198BD',
                  ],
                },
                strokeColorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: [
                    '#5A1846',
                    '#900C3F',
                    '#C70039',
                    '#E3611C',
                    '#F1920E',
                    '#FFC300',
                  ],
                },
              },
            };
          }
        }

        if (!layer) {
          throw new Error(`Invalid layer type: ${layerType}.`);
        }

        const columns: Record<string, { value: string; fieldIdx: number }> =
          layer?.config?.columns || {};

        // Construct new layer config for addLayer() action
        const newLayer: Record<string, any> = {
          id: layerId,
          type: layer.type,
          config: {
            ...layer.config,
            dataId: datasetId,
            label: layerName || `${tableName}-${layerType}`,
            columns: (() => {
              const asStrings = Object.keys(columns).reduce(
                (acc: Record<string, string>, key: string) => {
                  const column = columns[key];
                  if (column) {
                    acc[key] =
                      typeof column === 'string' ? column : column.value;
                  }
                  return acc;
                },
                {} as Record<string, string>
              );
              // ensure H3 uses string column mapping
              if (layer.type === 'hexagonId') {
                asStrings.hex_id =
                  hexIdColumn ||
                  (typeof columns.hex_id === 'string'
                    ? columns.hex_id
                    : columns.hex_id?.value);
              }
              return asStrings;
            })(),
            visConfig: {
              ...layer.visConfig,
            },
          },
        };

        if (colorBy) {
          const colorField = (dataset as KeplerTable).fields.find(
            (f) => f.name === colorBy
          );
          if (!colorField) {
            throw new Error(`Field ${colorBy} not found.`);
          }
          const colorScale =
            colorType === 'breaks' ? 'custom' : 'customOrdinal';
          const colors = colorMap?.map((c) => c.color);
          const keplerColorMap = colorMap.map((c) => [c.value, c.color]);
          const colorRange = {
            name: 'color.customPalette',
            type: 'custom',
            category: 'Custom',
            colors,
            colorMap: keplerColorMap,
          } as const;

          newLayer.config['colorScale'] = colorScale;
          newLayer.config['colorField'] = colorField;
          newLayer.config['strokeColorScale'] = colorScale;
          newLayer.config['strokeColorField'] = colorField;
          newLayer.config.visConfig['filled'] = true;
          newLayer.config.visConfig['colorRange'] = colorRange;
          newLayer.config.visConfig['strokeColorRange'] = colorRange;
          newLayer.config.visualChannels = {
            colorField: {
              name: colorBy,
              type: colorField?.type,
            },
            colorScale,
          };
        }

        // Check if layer already exists before adding
        const existingLayers = map?.visState?.layers || [];
        const layerExists = existingLayers.some(
          (l: { id: string }) => l.id === layerId
        );

        const newMapId = state.kepler.createMap(`default_${generateId()}`);
        if (!layerExists) {
          // create a new map 
          const { kepler } = store.getState();
          await kepler.addTableToMap(newMapId, tableName);
          // Call addLayer directly instead of relying on component mounting
          const addLayer = kepler.addLayer;
          addLayer(newMapId, newLayer as any, datasetId);
        }

        return {
          llmResult: {
            success: true,
            details: layerExists
              ? `Layer ${layerId} already exists on the map.`
              : `map layer ${layerId} will be added to the map.`,
          },
          additionalData: {
            layer: newLayer,
            datasetId,
            mapId: newMapId,
          },
        };
      } catch (error) {
        return {
          llmResult: {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            instruction:
              'Try to fix the error. If the error persists, pause and ask the user to adjust.',
          },
          additionalData: {
            layer: null,
            datasetId: null,
          },
        };
      }
    },
    component: ResizableKeplerMapContainer,
  };
}
