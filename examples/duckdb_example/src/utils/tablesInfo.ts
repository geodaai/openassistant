import { getDuckDB } from '@openassistant/duckdb';

export async function getTablesInfoFromDatabase(): Promise<string> {
  try {
    const db = await getDuckDB();
    if (!db) {
      return 'DuckDB instance is not initialized';
    }

    const conn = await db.connect();
    
    // Get all table names
    const tablesResult = await conn.query('SHOW TABLES');
    const tables = tablesResult.toArray().map(row => row.toJSON());
    
    if (tables.length === 0) {
      await conn.close();
      return 'No tables found in the database';
    }

    let result = '';
    
    // For each table, get column information
    for (const table of tables) {
      const tableName = table.name;
      result += `${tableName}\n`;
      
      try {
        // Get column information using DESCRIBE
        const columnsResult = await conn.query(`DESCRIBE ${tableName}`);
        const columns = columnsResult.toArray().map(row => row.toJSON());
        
        for (const column of columns) {
          result += `  ${column.column_name}\n`;
        }
      } catch (error) {
        result += `  Error getting columns: ${error instanceof Error ? error.message : String(error)}\n`;
      }
      
      result += '\n'; // Add blank line between tables
    }
    
    await conn.close();
    return result.trim(); // Remove trailing newline
    
  } catch (error) {
    console.error('Error getting tables info:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export const getTablesInfoTool = {
  description: 'Get information about all tables and their columns in the DuckDB database',
  parameters: {},
  execute: async () => {
    const info = await getTablesInfoFromDatabase();
    return {
      success: true,
      data: info,
    };
  },
};
