// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { generateId, extendedTool } from '@openassistant/utils';
import { isSearchAPIToolContext, SearchAPIToolContext } from './register-tools';

// Types for SearchAPI response
interface SearchAPISearchMetadata {
  id: string;
  status: string;
  created_at: string;
  request_time_taken: number;
  parsing_time_taken: number;
  total_time_taken: number;
  request_url: string;
  html_url: string;
  json_url: string;
}

interface SearchAPISearchParameters {
  engine: string;
  q: string;
  device: string;
  google_domain: string;
  hl: string;
  gl: string;
}

interface SearchAPISearchInformation {
  query_displayed: string;
  detected_location?: string;
  has_no_results_for: boolean;
}

interface SearchAPISitelink {
  title: string;
  link: string;
}

interface SearchAPISitelinks {
  inline?: SearchAPISitelink[];
}

interface SearchAPIRichSnippet {
  extensions?: string[];
}

interface SearchAPIOrganicResult {
  position: number;
  title: string;
  link: string;
  source: string;
  domain: string;
  displayed_link: string;
  snippet: string;
  snippet_highlighted_words?: string[];
  sitelinks?: SearchAPISitelinks;
  rich_snippet?: SearchAPIRichSnippet;
  favicon?: string;
}

interface SearchAPIRelatedSearch {
  query: string;
  link: string;
}

interface SearchAPIPagination {
  current: number;
  next?: string;
}

interface SearchAPIResponse {
  search_metadata: SearchAPISearchMetadata;
  search_parameters: SearchAPISearchParameters;
  search_information: SearchAPISearchInformation;
  organic_results: SearchAPIOrganicResult[];
  related_searches?: SearchAPIRelatedSearch[];
  pagination?: SearchAPIPagination;
}

export type WebSearchFunctionArgs = z.ZodObject<{
  query: z.ZodString;
  engine: z.ZodOptional<z.ZodString>;
  device: z.ZodOptional<z.ZodString>;
  google_domain: z.ZodOptional<z.ZodString>;
  hl: z.ZodOptional<z.ZodString>;
  gl: z.ZodOptional<z.ZodString>;
  num: z.ZodOptional<z.ZodNumber>;
}>;

export type WebSearchLlmResult = {
  success: boolean;
  datasetName?: string;
  query?: string;
  result?: string;
  error?: string;
};

export type WebSearchAdditionalData = {
  query: string;
  datasetName: string;
  [datasetName: string]: unknown;
};

export type ExecuteWebSearchResult = {
  llmResult: WebSearchLlmResult;
  additionalData?: WebSearchAdditionalData;
};

/**
 * ## Web Search Tool
 *
 * This tool performs web searches using the SearchAPI with Google search engine. It takes a query string
 * and returns structured search results that can be used by LLMs and saved as JSON datasets.
 *
 * Example user prompts:
 * - "Search for information about artificial intelligence"
 * - "Find the latest news about climate change"
 * - "Search for redfin 4440 S Oleander Dr Chandler AZ"
 * - "What are the best restaurants in New York?"
 * - "Find information about machine learning algorithms"
 *
 * @example
 * ```typescript
 * import { webSearch, WebSearchTool } from "@openassistant/places";
 * import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * // you can use ToolCache to save the web search dataset for later use
 * const toolResultCache = ToolCache.getInstance();
 *
 * const webSearchTool: WebSearchTool = {
 *   ...webSearch,
 *   toolContext: {
 *     getSearchAPIKey: () => process.env.SEARCH_API_KEY!,
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     toolResultCache.addDataset(toolCallId, additionalData);
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Search for information about artificial intelligence',
 *   tools: {
 *     webSearch: convertToVercelAiTool(webSearchTool),
 *   },
 * });
 * ```
 */
export const webSearch = extendedTool<
  WebSearchFunctionArgs,
  WebSearchLlmResult,
  WebSearchAdditionalData,
  SearchAPIToolContext
>({
  description: 'Search the web using Google search engine via SearchAPI.',
  parameters: z.object({
    query: z
      .string()
      .describe(
        'The search query to perform (e.g., "artificial intelligence", "latest news")'
      ),
    engine: z
      .string()
      .describe('The search engine to use (default: google)')
      .optional(),
    device: z
      .string()
      .describe('The device type for search results (default: desktop)')
      .optional(),
    google_domain: z
      .string()
      .describe('The Google domain to use (default: google.com)')
      .optional(),
    hl: z
      .string()
      .describe('The language for search results (default: en)')
      .optional(),
    gl: z
      .string()
      .describe('The country for search results (default: us)')
      .optional(),
    num: z
      .number()
      .min(1)
      .max(20)
      .describe('Number of search results to return (1-20, default: 10)')
      .optional(),
  }),
  execute: async (args, options): Promise<ExecuteWebSearchResult> => {
    console.log(
      '🔍 webSearch.execute called with args:',
      JSON.stringify(args, null, 2)
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const {
        query,
        engine = 'google',
        device = 'desktop',
        google_domain = 'google.com',
        hl = 'en',
        gl = 'us',
        num = 10,
      } = args;

      console.log('📋 Parsed arguments:');
      console.log('  - query:', query);
      console.log('  - engine:', engine);
      console.log('  - device:', device);
      console.log('  - google_domain:', google_domain);
      console.log('  - hl:', hl);
      console.log('  - gl:', gl);
      console.log('  - num:', num);

      // Generate output dataset name
      const outputDatasetName = `websearch_${generateId()}`;

      if (!options?.context || !isSearchAPIToolContext(options.context)) {
        throw new Error(
          'Context is required and must implement SearchAPIToolContext'
        );
      }

      const searchAPIKey = options.context.getSearchAPIKey();

      // Build SearchAPI URL
      const url = new URL('https://www.searchapi.io/api/v1/search');
      console.log('🌐 Building SearchAPI URL...');

      // Add required parameters
      url.searchParams.set('engine', engine);
      url.searchParams.set('q', query);
      url.searchParams.set('device', device);
      url.searchParams.set('google_domain', google_domain);
      url.searchParams.set('hl', hl);
      url.searchParams.set('gl', gl);
      url.searchParams.set('num', num.toString());

      console.log('  ✅ Added search parameters');
      console.log('  - engine:', engine);
      console.log('  - query:', query);
      console.log('  - device:', device);
      console.log('  - google_domain:', google_domain);
      console.log('  - hl:', hl);
      console.log('  - gl:', gl);
      console.log('  - num:', num);

      // Call SearchAPI
      console.log('🚀 Making SearchAPI call to:', url.toString());
      console.log(
        '🔑 Using API key:',
        searchAPIKey ? '***' + searchAPIKey.slice(-4) : 'undefined'
      );

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${searchAPIKey}`,
        },
      });
      clearTimeout(timeoutId);

      console.log(
        '📡 API Response status:',
        response.status,
        response.statusText
      );

      if (!response.ok) {
        throw new Error(
          `SearchAPI error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as SearchAPIResponse;

      if (!data.organic_results || data.organic_results.length === 0) {
        return {
          llmResult: {
            success: false,
            error: 'No search results found for the given query',
          },
        };
      }

      // Format results for better readability
      const formattedResults = data.organic_results.map((result) => ({
        position: result.position,
        title: result.title,
        link: result.link,
        source: result.source,
        domain: result.domain,
        displayed_link: result.displayed_link,
        snippet: result.snippet,
        snippet_highlighted_words: result.snippet_highlighted_words,
        sitelinks: result.sitelinks,
        rich_snippet: result.rich_snippet,
        favicon: result.favicon,
      }));

      return {
        llmResult: {
          success: true,
          datasetName: outputDatasetName,
          query,
          result: JSON.stringify(formattedResults, null, 2),
        },
        additionalData: {
          query,
          datasetName: outputDatasetName,
          [outputDatasetName]: {
            type: 'websearch',
            content: {
              search_metadata: data.search_metadata,
              search_parameters: data.search_parameters,
              search_information: data.search_information,
              organic_results: formattedResults,
              related_searches: data.related_searches,
              pagination: data.pagination,
            },
          },
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('💥 Error in webSearch.execute:', error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack =
        error instanceof Error ? error.stack : 'No stack trace available';

      console.error('  - Error message:', errorMessage);
      console.error('  - Error stack:', errorStack);

      return {
        llmResult: {
          success: false,
          error: `Failed to perform web search: ${errorMessage}`,
        },
      };
    }
  },
  context: {
    getSearchAPIKey: () => {
      throw new Error('getSearchAPIKey not implemented.');
    },
  },
});

export type WebSearchTool = typeof webSearch;

export type WebSearchToolContext = {
  getSearchAPIKey: () => string;
};
