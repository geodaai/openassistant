import React, { useCallback, useMemo } from 'react';
import {
  Assistant,
  MainView,
  useAssistantActions,
  type AssistantOptions,
} from '@openassistant/assistant';
import { getStateOrProvinceBoundariesTool } from '@openassistant/duckdb';
import { useFileDrop } from './utils/useFileDrop';
import { queryTool } from './tools/queryTool';
import { createQueryTool, QueryToolResult } from '@sqlrooms/ai';

const getInstructionsWithTablesInfo = () => {
  const baseInstructions =
    'You are a helpful assistant with access to a DuckDB database. Users can drag and drop files (like GeoJSON, CSV, etc.) to load them into the database, and you can help them query the data.';
  // const tablesInfo = await getTablesInfoFromDatabase();
  return baseInstructions;
};

// Component that uses the assistant actions - must be inside Assistant
function AppContentWithStore({
  storeRef,
}: {
  storeRef: React.MutableRefObject<any>;
}) {
  const { sendMessage, roomStore } = useAssistantActions();

  // Update the ref with the roomStore
  React.useEffect(() => {
    storeRef.current = roomStore;
  }, [roomStore, storeRef]);

  const handleFileLoaded = useCallback(
    (fileName: string, tableName: string, tableInfo: string) => {
      const message = `A new file "${fileName}" has been added in duckdb with table info: ${tableInfo}. The data is now available in table "${tableName}".`;
      sendMessage(message);
    },
    [sendMessage]
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
  // Create a ref to hold the roomStore
  const storeRef = React.useRef<any>(null);

  // Create the config dynamically to access the tool with lazy-loaded store
  const config: AssistantOptions = useMemo(() => {
    // Create a lazy wrapper that will get the tool when store is available
    const lazyQueryTool = {
      name: 'query',
      description:
        'A tool for running SQL queries on the tables in the database.',
      parameters: queryTool.parameters,
      execute: async (params: any, options: any) => {
        if (!storeRef.current) {
          throw new Error('Store is not yet initialized');
        }
        const tool = createQueryTool(storeRef.current);
        return tool.execute(params, options);
      },
      component: QueryToolResult,
    };

    return {
      ai: {
        getInstructions: getInstructionsWithTablesInfo,
        tools: {
          getStateOrProvinceBoundaries: getStateOrProvinceBoundariesTool,
          queryTool: lazyQueryTool,
        },
      },
    };
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <Assistant options={config}>
        <AppContentWithStore storeRef={storeRef} />
      </Assistant>
    </div>
  );
}
