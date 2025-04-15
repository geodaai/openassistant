import {
  getContiguityNeighborsFromBinaryGeometries,
  getMetaFromWeights,
  WeightsMeta,
  BinaryGeometryType,
  getNearestNeighborsFromBinaryGeometries,
  getDistanceNeighborsFromBinaryGeometries,
} from '@geoda/core';
import { BinaryFeatureCollection } from '@loaders.gl/schema';

export type WeightsProps = {
  datasetId: string;
  weightsMeta: WeightsMeta;
  weights: number[][];
  weightsValues?: number[][];
  // isNew is used to determine if the weights are newly added by chatbot, so a number badge can be shown on the weights icon
  isNew?: boolean;
};

export type CreateWeightsOutputProps = {
  weights: number[][];
  weightsMeta: WeightsMeta;
};

export type CreateContiguityWeightsProps = {
  datasetId: string;
  weightsType: 'contiguity';
  contiguityType: string;
  binaryGeometryType: BinaryGeometryType;
  binaryGeometries: BinaryFeatureCollection[];
  precisionThreshold: number;
  orderOfContiguity: number;
  includeLowerOrder: boolean;
};

export async function createContiguityWeights(
  weightsProps: CreateContiguityWeightsProps
) {
  const id = getWeightsId(weightsProps);
  const isQueen = weightsProps.contiguityType === 'queen';
  const useCentroids =
    weightsProps.binaryGeometryType.point ||
    weightsProps.binaryGeometryType.line;
  const weights = await getContiguityNeighborsFromBinaryGeometries({
    binaryGeometryType: weightsProps.binaryGeometryType,
    binaryGeometries: weightsProps.binaryGeometries,
    isQueen,
    useCentroids,
    precisionThreshold: weightsProps.precisionThreshold,
    orderOfContiguity: weightsProps.orderOfContiguity,
    includeLowerOrder: weightsProps.includeLowerOrder,
  });
  const weightsMeta: WeightsMeta = {
    ...getMetaFromWeights(weights),
    id,
    type: weightsProps.contiguityType === 'queen' ? 'queen' : 'rook',
    symmetry: 'symmetric',
    order: weightsProps.orderOfContiguity,
    includeLowerOrder: weightsProps.includeLowerOrder,
    threshold: weightsProps.precisionThreshold,
  };
  return { weights, weightsMeta };
}

export type CreateKNNWeightsProps = {
  datasetId: string;
  weightsType: 'knn';
  k: number;
  binaryGeometryType: BinaryGeometryType;
  binaryGeometries: BinaryFeatureCollection[];
};

export async function createKNNWeights(weightsProps: CreateKNNWeightsProps) {
  const id = getWeightsId(weightsProps);
  const weights = await getNearestNeighborsFromBinaryGeometries({
    k: weightsProps.k,
    binaryGeometryType: weightsProps.binaryGeometryType,
    binaryGeometries: weightsProps.binaryGeometries,
  });
  const weightsMeta: WeightsMeta = {
    ...getMetaFromWeights(weights),
    id,
    type: 'knn',
    symmetry: 'symmetric',
    k: weightsProps.k,
  };
  return { weights, weightsMeta };
}

export type CreateDistanceWeightsProps = {
  datasetId: string;
  weightsType: 'band';
  distanceThreshold: number;
  isMile: boolean;
  binaryGeometryType: BinaryGeometryType;
  binaryGeometries: BinaryFeatureCollection[];
};

export async function createDistanceWeights(
  weightsProps: CreateDistanceWeightsProps
) {
  const weights = await getDistanceNeighborsFromBinaryGeometries({
    distanceThreshold: weightsProps.distanceThreshold,
    isMile: weightsProps.isMile,
    binaryGeometryType: weightsProps.binaryGeometryType,
    binaryGeometries: weightsProps.binaryGeometries,
  });
  // convert distanceThreshold to string and keep one decimal
  const id = getWeightsId(weightsProps);
  const weightsMeta: WeightsMeta = {
    ...getMetaFromWeights(weights),
    id,
    type: 'threshold',
    symmetry: 'symmetric',
    threshold: weightsProps.distanceThreshold,
    // @ts-expect-error TODO: fix this in geoda-lib
    isMile: weightsProps.isMile,
  };
  return { weights, weightsMeta };
}

export type CreateWeightsProps = {
  datasetId: string;
} & (
  | CreateContiguityWeightsProps
  | CreateKNNWeightsProps
  | CreateDistanceWeightsProps
);

export async function createWeights(props: CreateWeightsProps) {
  let result: CreateWeightsOutputProps | null = null;

  if (props.weightsType === 'contiguity') {
    result = await createContiguityWeights({
      datasetId: props.datasetId,
      weightsType: props.weightsType,
      contiguityType: props.contiguityType,
      binaryGeometryType: props.binaryGeometryType,
      binaryGeometries: props.binaryGeometries,
      precisionThreshold: props.precisionThreshold,
      orderOfContiguity: props.orderOfContiguity,
      includeLowerOrder: props.includeLowerOrder,
    });
  } else if (props.weightsType === 'knn') {
    const k = props.k;
    result = await createKNNWeights({
      datasetId: props.datasetId,
      weightsType: props.weightsType,
      k,
      binaryGeometryType: props.binaryGeometryType,
      binaryGeometries: props.binaryGeometries,
    });
  } else if (props.weightsType === 'band') {
    result = await createDistanceWeights({
      datasetId: props.datasetId,
      weightsType: props.weightsType,
      distanceThreshold: props.distanceThreshold,
      isMile: props.isMile,
      binaryGeometryType: props.binaryGeometryType,
      binaryGeometries: props.binaryGeometries,
    });
  }

  // const {weights, weightsMeta} = result;
  return result;
}

export function getWeightsId(props: CreateWeightsProps) {
  let id: string | null = null;
  if (props.weightsType === 'contiguity') {
    id = `w-${props.datasetId}-${props.contiguityType}-${props.orderOfContiguity}${props.includeLowerOrder ? '-lower' : ''}`;
  } else if (props.weightsType === 'knn') {
    id = `w-${props.datasetId}-${props.k}-nn`;
  } else if (props.weightsType === 'band') {
    const distanceThresholdString = props.distanceThreshold.toFixed(1);
    id = `w-${props.datasetId}-distance-${distanceThresholdString}${props.isMile ? '-mile' : 'km'}`;
  } else {
    throw new Error('weights type is not supported');
  }
  return id;
}

export function checkWeightsIdExist(
  props: CreateWeightsProps,
  weights: WeightsProps[]
) {
  const id = getWeightsId(props);
  return weights.find((w) => w.weightsMeta.id === id);
}
