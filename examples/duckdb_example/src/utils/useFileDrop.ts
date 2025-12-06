import { useState, useCallback } from 'react';
import { useAssistant } from '@openassistant/assistant';

// File loading function
async function loadFileToDatabase(
  file: File,
  duckDBStore: any, // Store passed from useAssistant
  onFileLoaded?: (
    fileName: string,
    tableName: string,
    tableInfo: Record<string, object> | null
  ) => void
): Promise<void> {
  try {
    // Generate a table name based on the file name (remove extension and sanitize)
    const tableName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_]/g, '_');

    // Get the connector and load the file
    const connector = await duckDBStore.db.getConnector();
    if (!connector) {
      throw new Error('DuckDB connector is not initialized');
    }

    // Load the file using connector.loadFile instead of loadDataToTable
    await connector.loadFile(file, tableName, {
      method: 'auto',
      replace: true,
    });

    console.log(`File ${file.name} loaded into table: ${tableName}`);

    // Get table info and call the callback if provided
    if (onFileLoaded) {
      try {
        // Get column information
        const columnsResult = await connector.query(`DESCRIBE ${tableName}`);
        const columns = columnsResult.toArray().map((row: any) => row.toJSON());

        // Get row count
        const countResult = await connector.query(
          `SELECT COUNT(*) as count FROM ${tableName}`
        );
        const rowCount = countResult.toArray()[0].toJSON().count;

        const tableInfo = {
          rowCount,
          columns: columns.map(({ column_name }: any) => ({
            column_name,
          })),
        };

        onFileLoaded(file.name, tableName, tableInfo);
      } catch (error) {
        console.error('Error getting table info:', error);
        onFileLoaded(file.name, tableName, null);
      }
    }
  } catch (error) {
    console.error(
      `Error loading file: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error; // Re-throw so the caller knows it failed
  }
}

export interface UseFileDropReturn {
  isDragOver: boolean;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  loadFileToDatabase: (file: File) => Promise<void>;
}

export interface UseFileDropOptions {
  onFileLoaded?: (
    fileName: string,
    tableName: string,
    tableInfo: Record<string, object> | null
  ) => void;
}

export function useFileDrop(options?: UseFileDropOptions): UseFileDropReturn {
  const [isDragOver, setIsDragOver] = useState(false);
  const { store } = useAssistant();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);

      if (files.length === 0) {
        return;
      }

      // Process each dropped file
      for (const file of files) {
        try {
          await loadFileToDatabase(file, store, options?.onFileLoaded);
        } catch (error) {
          console.error(`Failed to load file ${file.name}:`, error);
        }
      }
    },
    [store, options?.onFileLoaded]
  );

  return {
    isDragOver,
    dragHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    loadFileToDatabase: (file: File) =>
      loadFileToDatabase(file, store, options?.onFileLoaded),
  };
}
