/**
 * A dataset in the tool cache.
 * The type of the content is determined by the tool that added the dataset.
 * The type includes:
 * - 'array'
 * - 'geojson' (GeoJSON Feature or FeatureCollection)
 * - 'object'
 */
export type ToolCacheDataset = {
  type: 'array' | 'geojson' | 'object';
  content: unknown;
};

/**
 * A singleton class to cache the results of tools.
 *
 */
export class ToolCache {
  private static instance: ToolCache;
  private cachedResults: Record<string, unknown> = {};

  private constructor() {}

  public static getInstance(): ToolCache {
    if (!ToolCache.instance) {
      ToolCache.instance = new ToolCache();
    }
    return ToolCache.instance;
  }

  get toolCache(): Record<string, unknown> {
    return this.cachedResults;
  }

  addDataset(toolCallId: string, additionalData: unknown): void {
    if (
      toolCallId &&
      additionalData &&
      typeof additionalData === 'object' &&
      'datasetName' in additionalData &&
      additionalData.datasetName
    ) {
      const datasetName = additionalData.datasetName;
      if (datasetName && typeof datasetName === 'string') {
        const dataset = additionalData[datasetName];
        // dataset should be an object with a type property and a content property
        this.cachedResults = {
          ...this.cachedResults,
          [datasetName]: dataset,
        };
      }
    }
  }

  clearCache(): void {
    this.cachedResults = {};
  }

  removeDataset(datasetName: string): void {
    const newCache = { ...this.cachedResults };
    delete newCache[datasetName];
    this.cachedResults = newCache;
  }

  hasDataset(datasetName: string): boolean {
    return datasetName in this.cachedResults;
  }

  getDataset(datasetName: string): ToolCacheDataset | null {
    return this.cachedResults[datasetName] as ToolCacheDataset | null;
  }
}
