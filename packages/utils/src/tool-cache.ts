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
      const datasetName = additionalData.datasetName as string;
      if (datasetName) {
        this.cachedResults = {
          ...this.cachedResults,
          [datasetName]: additionalData[datasetName],
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

  getDataset(datasetName: string): unknown | null {
    return this.cachedResults[datasetName] || null;
  }
}
