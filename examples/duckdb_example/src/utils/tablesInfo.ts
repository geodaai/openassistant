export async function getTablesInfoFromDatabase(
  duckDBStore: any
): Promise<string> {
  try {
    const connector = await duckDBStore.getState().db.getConnector();
    if (!connector) {
      return 'DuckDB connector is not initialized';
    }

    // Get all table names
    const tablesResult = await connector.query('SHOW TABLES');
    const tables = tablesResult.toArray().map((row: any) => row.toJSON());

    if (tables.length === 0) {
      return 'No tables found in the database';
    }

    let result = '';

    // For each table, get column information
    for (const table of tables) {
      const tableName = table.name;
      result += `${tableName}\n`;

      try {
        // Get column information using DESCRIBE
        const columnsResult = await connector.query(`DESCRIBE ${tableName}`);
        const columns = columnsResult.toArray().map((row: any) => row.toJSON());

        for (const column of columns) {
          result += `  ${column.column_name}\n`;
        }
      } catch (error) {
        result += `  Error getting columns: ${error instanceof Error ? error.message : String(error)}\n`;
      }

      result += '\n'; // Add blank line between tables
    }

    return result.trim(); // Remove trailing newline
  } catch (error) {
    console.error('Error getting tables info:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
