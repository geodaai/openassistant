
/**
 * Apply a join operation to a list of values
 * @param joinOperator - The join operation to apply, the following are supported:
 * - 'sum' - Sum the values
 * - 'mean' - Mean the values
 * - 'min' - Min the values
 * - 'max' - Max the values
 * @param values - The list of values to apply the join operation to
 * @returns The result of the join operation
 */
export function applyJoin(joinOperator: string, values: number[]) {
  switch (joinOperator) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'mean':
      return values.reduce((a, b) => a + b, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    default:
      throw new Error(`Unsupported join operator: ${joinOperator}`);
  }
}