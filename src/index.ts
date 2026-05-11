// Components
export {AiAssistantPanel} from './components/ai-assistant-manager';
export type {AiAssistantPanelProps} from './components/ai-assistant-manager';
export {AiAssistantComponent} from './components/ai-assistant-component';
export {BrushLinkProvider} from './components/echarts-renderers';
export type {BrushLinkCallback} from './components/echarts-renderers';
export {default as AiAssistantControlFactory} from './map/ai-assistant-control';

// Store
export {createAiAssistantStore} from './store';
export type {AiAssistantStoreState, KeplerBridge} from './store';

// Types
export type {KeplerContext} from './types';

// Agents
export {keplerAgentTool} from './agents/kepler-agent';
export {echartsAgentTool} from './agents/echarts-agent';
export {geoAgentTool} from './agents/geo-agent';
export {spatialAnalysisAgentTool} from './agents/spatial-analysis-agent';

// Tools
export {getAllTools} from './tools/tools';
export {getKeplerTools} from './tools/kepler-tools';
export {getEchartsTools} from './tools/echarts-tools';
export {getGeoTools} from './tools/geo-tools';
export {getSpatialAnalysisTools} from './tools/spatial-analysis-tools';
export {getQueryTools} from './tools/query-tool';
export {datasetNameToTableName} from './tools/utils';

// DuckDB
export {
  saveToDuckdb,
  saveGeojsonToDuckdb,
  saveRowsToDuckdb,
  saveColumnsToDuckdb,
  tableExists,
  dropTable,
  queryTable,
  getTableAsGeoJSON,
  hasGeometryColumn,
  loadTableToKepler,
  getDuckdbTableNames,
  getDuckdbTableContext,
  getDuckdbTableContextSync
} from './tools/duckdb-cache';
export type {DuckdbTableInfo} from './tools/duckdb-cache';

// Config
export {AI_SETTINGS, PROVIDER_DEFAULT_BASE_URLS, LLM_MODELS} from './config/models';

// Constants
export {INSTRUCTIONS, WELCOME_MESSAGE, PROMPT_IDEAS} from './constants';