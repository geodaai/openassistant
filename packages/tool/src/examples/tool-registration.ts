import ToolRegistry from '../ToolRegistry';
import ToolManager from '../ToolManager';
import type { ToolFunction } from '../ToolManager';

// Example tool implementations
const duckdbTools: Record<string, ToolFunction> = {
  query: (args, options, context) => {
    // DuckDB query implementation
    return { result: 'query result' };
  },
  createTable: (args, options, context) => {
    // DuckDB create table implementation
    return { result: 'table created' };
  }
};

const echartsTools: Record<string, ToolFunction> = {
  createChart: (args, options, context) => {
    // ECharts chart creation implementation
    return { result: 'chart created' };
  }
};

const keplerglTools: Record<string, ToolFunction> = {
  createMap: (args, options, context) => {
    // KeplerGL map creation implementation
    return { result: 'map created' };
  }
};

// Register tool packages
const registry = ToolRegistry.getInstance();

registry.registerPackage({
  name: 'duckdb',
  tools: duckdbTools
});

registry.registerPackage({
  name: 'echarts',
  tools: echartsTools
});

registry.registerPackage({
  name: 'keplergl',
  tools: keplerglTools,
  dependencies: ['duckdb'] // Example: KeplerGL might depend on DuckDB for data
});

// Example usage
async function example() {
  const toolManager = new ToolManager();

  // Load only the packages you need
  await toolManager.loadPackage('duckdb');
  await toolManager.loadPackage('echarts');

  // Now you can use the tools from loaded packages
  const queryTool = toolManager.getTool('query', { database: 'myDB' });
  const chartTool = toolManager.getTool('createChart', { theme: 'dark' });

  // Use the tools
  const queryResult = await queryTool({ sql: 'SELECT * FROM table' });
  const chartResult = await chartTool({ type: 'bar', data: [] });

  console.log('Available packages:', toolManager.getAvailablePackages());
  console.log('Loaded packages:', toolManager.getLoadedPackages());
  console.log('Available tools:', toolManager.getAvailableTools());
}

// Run the example
example().catch(console.error); 