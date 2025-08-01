// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  isCreateMapOutputData,
  KeplerGlComponent,
} from '@openassistant/keplergl';
import { memo } from 'react';

export const KeplerGlTool = memo(
  function KeplerGlTool({
    additionalData,
  }: {
    toolCallId: string;
    additionalData: unknown;
  }) {
    if (isCreateMapOutputData(additionalData)) {
      return <KeplerGlComponent {...additionalData} />;
    }
    return null;
  },
  (prevProps, nextProps) => {
    // Deep comparison of additionalData
    return prevProps.toolCallId === nextProps.toolCallId;
  }
);

export default KeplerGlTool; 