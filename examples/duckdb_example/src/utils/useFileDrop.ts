import { useState, useCallback } from 'react';

// File loading function
async function loadFileToDatabase(file: File, onFileLoaded?: (fileName: string, tableName: string, tableInfo: string) => void): Promise<void> {
  try {
    // Import the loadDataToTable function from DuckDB tools
    const { loadDataToTable, getDuckDB } = await import('@openassistant/duckdb');
    
    // Generate a table name based on the file name (remove extension and sanitize)
    const tableName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Load the file into DuckDB
    await loadDataToTable(file, tableName);
    
    console.log(`File ${file.name} loaded into table: ${tableName}`);
    
    // Get table info and call the callback if provided
    if (onFileLoaded) {
      try {
        const db = await getDuckDB();
        if (db) {
          const conn = await db.connect();
          
          // Get column information
          const columnsResult = await conn.query(`DESCRIBE ${tableName}`);
          const columns = columnsResult.toArray().map(row => row.toJSON());
          
          // Get row count
          const countResult = await conn.query(`SELECT COUNT(*) as count FROM ${tableName}`);
          const rowCount = countResult.toArray()[0].toJSON().count;
          
          await conn.close();
          
          // Format table info
          const columnInfo = columns.map(col => `${col.column_name} (${col.column_type})`).join(', ');
          const tableInfo = `${rowCount} rows with columns: ${columnInfo}`;
          
          onFileLoaded(file.name, tableName, tableInfo);
        }
      } catch (error) {
        console.error('Error getting table info:', error);
        // Still call the callback with basic info
        onFileLoaded(file.name, tableName, 'table information unavailable');
      }
    }
  } catch (error) {
    console.error(`Error loading file: ${error instanceof Error ? error.message : String(error)}`);
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
  onFileLoaded?: (fileName: string, tableName: string, tableInfo: string) => void;
}

export function useFileDrop(options?: UseFileDropOptions): UseFileDropReturn {
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
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
        await loadFileToDatabase(file, options?.onFileLoaded);
      } catch (error) {
        console.error(`Failed to load file ${file.name}:`, error);
      }
    }
  }, [options?.onFileLoaded]);

  return {
    isDragOver,
    dragHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    loadFileToDatabase: (file: File) => loadFileToDatabase(file, options?.onFileLoaded),
  };
}
