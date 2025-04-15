import { BinaryGeometryType, WeightsMeta } from '@geoda/core';
import { BinaryFeatureCollection } from '@loaders.gl/schema';
import {
  createDistanceWeights,
  CreateWeightsProps,
  createContiguityWeights,
  checkWeightsIdExist,
  createKNNWeights,
} from './weights-utils';
import { GetGeometries } from './tool';
import { WeightsProps } from '../types';

export async function runSpatialWeights({
  existingWeights,
  datasetName,
  type,
  k,
  orderOfContiguity,
  includeLowerOrder,
  precisionThreshold,
  distanceThreshold,
  isMile,
  getGeometries,
}: {
  existingWeights: WeightsProps[];
  datasetName: string;
  type: 'knn' | 'queen' | 'rook' | 'distance' | 'kernel';
  k?: number;
  orderOfContiguity?: number;
  includeLowerOrder?: boolean;
  precisionThreshold?: number;
  distanceThreshold?: number;
  isMile?: boolean;
  getGeometries: GetGeometries;
}) {
  try {
    if (type === 'knn' && k && k <= 0) {
      throw new Error('Invalid k value for knn weights');
    }
    if (type === 'distance' && !distanceThreshold) {
      throw new Error('Invalid distance threshold for distance weights');
    }

    const { binaryGeometryType, binaryGeometries } = getGeometries(datasetName);

    if (!binaryGeometries || !binaryGeometryType) {
      throw new Error(
        `Error: geometries are empty. Please implement the getGeometries() context function.`
      );
    }

    let w: { weightsMeta: WeightsMeta; weights: number[][] } | null = null;

    if (type === 'knn' && k && k > 0) {
      w = await kNNWeights(
        existingWeights,
        datasetName,
        k,
        binaryGeometryType,
        binaryGeometries
      );
    } else if (type === 'queen' || type === 'rook') {
      w = await contiguityWeights(
        existingWeights,
        datasetName,
        type,
        orderOfContiguity || 1,
        includeLowerOrder || false,
        precisionThreshold || 0,
        binaryGeometryType,
        binaryGeometries
      );
    } else if (type === 'distance' && distanceThreshold) {
      w = await distanceWeights(
        existingWeights,
        datasetName,
        distanceThreshold,
        isMile || false,
        binaryGeometryType,
        binaryGeometries
      );
    }

    if (!w) {
      throw new Error('Error: weights creation failed.');
    }
    return {
      llmResult: {
        success: true,
        datasetName,
        weightsMeta: w.weightsMeta,
        details: `Weights created successfully.`,
      },
      addtionalData: {
        datasetName,
        weights: w.weights,
        weightsMeta: w.weightsMeta,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

function getWeightsFromWeightsData(
  createWeightsProps: CreateWeightsProps,
  weightsData: WeightsProps[]
) {
  const existingWeightData = checkWeightsIdExist(
    createWeightsProps,
    weightsData
  );
  if (existingWeightData) {
    return {
      weightsMeta: existingWeightData.weightsMeta,
      weights: existingWeightData.weights,
    };
  }
  return null;
}

export async function kNNWeights(
  weightsData: WeightsProps[],
  datasetId: string,
  k: number,
  binaryGeometryType: BinaryGeometryType,
  binaryGeometries: BinaryFeatureCollection[]
) {
  const createWeightsProps: CreateWeightsProps = {
    weightsType: 'knn',
    datasetId,
    k,
    binaryGeometryType,
    binaryGeometries,
  };

  const existingWeightData = getWeightsFromWeightsData(
    createWeightsProps,
    weightsData
  );
  if (existingWeightData) {
    return {
      weightsMeta: existingWeightData.weightsMeta,
      weights: existingWeightData.weights,
    };
  }

  const { weights, weightsMeta } = await createKNNWeights(createWeightsProps);

  return { weightsMeta, weights };
}

async function contiguityWeights(
  weightsData: WeightsProps[],
  datasetId: string,
  contiguityType: 'queen' | 'rook',
  orderOfContiguity: number,
  includeLowerOrder: boolean,
  precisionThreshold: number,
  binaryGeometryType: BinaryGeometryType,
  binaryGeometries: BinaryFeatureCollection[]
) {
  const createWeightsProps: CreateWeightsProps = {
    weightsType: 'contiguity',
    datasetId,
    contiguityType,
    binaryGeometryType,
    binaryGeometries,
    precisionThreshold: precisionThreshold || 0,
    orderOfContiguity: orderOfContiguity || 1,
    includeLowerOrder: includeLowerOrder || false,
  };

  const existingWeightData = getWeightsFromWeightsData(
    createWeightsProps,
    weightsData
  );
  if (existingWeightData) {
    return {
      weightsMeta: existingWeightData.weightsMeta,
      weights: existingWeightData.weights,
    };
  }

  const { weights, weightsMeta } =
    await createContiguityWeights(createWeightsProps);

  return { weightsMeta, weights };
}

async function distanceWeights(
  weightsData: WeightsProps[],
  datasetId: string,
  distanceThreshold: number,
  isMile: boolean,
  binaryGeometryType: BinaryGeometryType,
  binaryGeometries: BinaryFeatureCollection[]
) {
  const createWeightsProps: CreateWeightsProps = {
    datasetId,
    weightsType: 'band',
    distanceThreshold,
    isMile,
    binaryGeometryType,
    binaryGeometries,
  };

  const existingWeightData = getWeightsFromWeightsData(
    createWeightsProps,
    weightsData
  );
  if (existingWeightData) {
    return {
      weightsMeta: existingWeightData.weightsMeta,
      weights: existingWeightData.weights,
    };
  }

  const { weights, weightsMeta } =
    await createDistanceWeights(createWeightsProps);

  return { weightsMeta, weights };
}
