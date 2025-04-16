import { WeightsMeta } from '@geoda/core';

/**
 * The function of getting the values of a variable from the dataset.
 * @param datasetName - The name of the dataset.
 * @param variableName - The name of the variable.
 * @returns The values of the variable.
 */
export type GetValues = (
  datasetName: string,
  variableName: string
) => Promise<number[]>;

export type WeightsProps = {
  datasetId: string;
  weightsMeta: WeightsMeta;
  weights: number[][];
  weightsValues?: number[][];
};
