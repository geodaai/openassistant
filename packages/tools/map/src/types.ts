// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { SpatialGeometry } from '@geoda/core';

export type GetDataset = (datasetName: string) => Promise<unknown>;

export type GetGeometries = (
  datasetName: string
) => Promise<SpatialGeometry | null>;
