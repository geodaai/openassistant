// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import React from 'react';
import {
  isLeafletOutputData,
  LeafletMapComponent,
} from '@openassistant/leaflet';

export function LeafletTool({ additionalData }: { additionalData: unknown }) {
  if (!isLeafletOutputData(additionalData)) {
    return null;
  }

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <LeafletMapComponent {...additionalData} />
    </div>
  );
}

export default LeafletTool;
