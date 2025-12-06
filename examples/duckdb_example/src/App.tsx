import React, { MutableRefObject, useCallback, useEffect } from 'react';
import {
  Assistant,
  MainView,
  useAssistant,
  type AssistantOptions,
} from '@openassistant/assistant';
import { encode } from '@toon-format/toon';
import { useFileDrop } from './utils/useFileDrop';
import { createLazyQueryTool } from './tools/lazyQueryTool';
import { createLazyMapTool } from './tools/mapTool';
import { createGetCityBoundaryTool } from './tools/overtureTool';
import { createGetBuildingTool } from './tools/buildingTool';
import { createGetRoadTool } from './tools/roadTool';
import { createGetPlacesTool } from './tools/placesTool';

function AppContentWithStore({
  storeRef,
  tableInfoRef,
}: {
  storeRef: MutableRefObject<any>;
  tableInfoRef: MutableRefObject<Record<string, object>>;
}) {
  const { sendMessage, roomStore } = useAssistant();

  useEffect(() => {
    storeRef.current = roomStore;
  }, [roomStore, storeRef]);

  const handleFileLoaded = useCallback(
    async (
      fileName: string,
      tableName: string,
      tableInfo: Record<string, unknown> | null
    ) => {
      if (tableInfo === null) {
        const message = `Error loading file "${fileName}". The file may be invalid or corrupted.`;
        sendMessage(message);
        return;
      }
      // Update the table info ref directly
      tableInfoRef.current = {
        ...tableInfoRef.current,
        [tableName]: tableInfo,
      };

      // Sync table with kepler.gl
      const kepler = storeRef.current.getState().kepler;
      await kepler.syncKeplerDatasets();
      const currentMapId = kepler.getCurrentMap()?.id || '';
      await kepler.addTableToMap(currentMapId, tableName);

      const message = `A new file "${fileName}" has been added successfully. The data is now available in table "${tableName}".`;
      sendMessage(message);
    },
    [sendMessage, tableInfoRef]
  );

  const { isDragOver, dragHandlers } = useFileDrop({
    onFileLoaded: handleFileLoaded,
  });

  return (
    <div
      className={`w-full max-w-[900px] h-full relative transition-all duration-200 ${
        isDragOver ? 'ring-4 ring-blue-500 ring-opacity-50 bg-blue-50' : ''
      }`}
      {...dragHandlers}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-100 bg-opacity-90 border-2 border-dashed border-blue-500 rounded-lg">
          <div className="text-center">
            <div className="text-2xl text-blue-600 mb-2">📁</div>
            <div className="text-lg font-semibold text-blue-800">
              Drop files here
            </div>
            <div className="text-sm text-blue-600">
              Supports GeoJSON, CSV, Parquet, and more
            </div>
          </div>
        </div>
      )}
      <div className="flex h-full">
        <div className="flex-1">
          <MainView />
        </div>
      </div>
    </div>
  );
}

export function App() {
  // Create refs to hold the roomStore and table info
  const storeRef = React.useRef<any>(null);
  const tableInfoRef = React.useRef<Record<string, object>>({});

  const config: AssistantOptions = {
    ai: {
      getInstructions: () => {
        return `You are a helpful assistant with access to a DuckDB database in memory.
Users can drag and drop files (like GeoJSON, CSV, etc.) to load them into the database, and you can help them query and analyze the data.

Here are the tables in the database:
${encode(tableInfoRef.current)}`;
      },
      tools: {
        getCityBoundaries: createGetCityBoundaryTool(storeRef),
        getBuildings: createGetBuildingTool(storeRef),
        getRoads: createGetRoadTool(storeRef),
        getPlaces: createGetPlacesTool(storeRef),
        queryTool: createLazyQueryTool(storeRef),
        keplergl: createLazyMapTool(storeRef),
      },
    },
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <Assistant options={config}>
        <AppContentWithStore storeRef={storeRef} tableInfoRef={tableInfoRef} />
      </Assistant>
    </div>
  );
}
