import {
  createQueryTool,
  QueryToolParameters,
  QueryToolResult,
} from '@sqlrooms/ai';

/**
 * Creates a lazy query tool that defers store initialization.
 * This is useful when the store is not available at the time of tool creation.
 *
 * @param storeRef - A React ref that will eventually contain the roomStore
 * @returns A tool configuration object for the lazy query tool
 */
export function createLazyQueryTool(storeRef: React.MutableRefObject<any>) {
  return {
    name: 'query',
    description:
      'A tool for running SQL queries on the tables in the database.',
    parameters: QueryToolParameters,
    execute: async (params: any, options: any) => {
      if (!storeRef.current) {
        throw new Error('Store is not yet initialized');
      }
      const tool = createQueryTool(storeRef.current, {
        readOnly: false,
        autoSummary: false,
        numberOfRowsToShareWithLLM: 10,
      });
      return tool.execute(params, options);
    },
    component: QueryToolResult,
  };
}
