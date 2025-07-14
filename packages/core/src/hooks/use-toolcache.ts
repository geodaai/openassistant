// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { useState, useCallback } from 'react';

export const useToolCache = () => {
  const [cachedResults, setCachedResults] = useState<Record<string, unknown>>(
    {}
  );

  const updateToolCache = useCallback(
    (toolCallId: string, additionalData: unknown) => {
      if (
        additionalData &&
        typeof additionalData === 'object' &&
        'datasetName' in additionalData &&
        additionalData.datasetName
      ) {
        const datasetName = additionalData.datasetName as string;
        if (datasetName) {
          setCachedResults((prev) => ({
            ...prev,
            [datasetName]: additionalData[datasetName],
          }));
        }
      }
    },
    []
  );

  return {
    toolCache: cachedResults,
    updateToolCache,
  };
};
