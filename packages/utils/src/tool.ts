import { z } from 'zod';

export type Parameters = z.ZodTypeAny;

export type inferParameters<PARAMETERS extends Parameters> =
  PARAMETERS extends z.ZodTypeAny ? z.infer<PARAMETERS> : never;

export type ExecuteFunctionResult<
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
> = {
  llmResult: RETURN_TYPE extends never ? RETURN_TYPE : object;
  additionalData?: ADDITIONAL_DATA extends never ? ADDITIONAL_DATA : object;
};

export type ExecuteFunction<
  PARAMETERS extends Parameters,
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
  CONTEXT = never,
> = (
  args: inferParameters<PARAMETERS>,
  options?: {
    context?: CONTEXT extends never ? CONTEXT : unknown;
    previousExecutionOutput?: unknown;
  }
) => PromiseLike<ExecuteFunctionResult<RETURN_TYPE, ADDITIONAL_DATA>>;

export type ExtendedTool<
  PARAMETERS extends Parameters = never,
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
  CONTEXT = unknown,
> = {
  description: string;
  parameters: PARAMETERS;
  execute: ExecuteFunction<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT>;
  context?: CONTEXT;
  component?: React.ElementType;
  priority?: number;
};

export function tool<
  PARAMETERS extends Parameters = never,
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
  CONTEXT = never,
>(
  tool: ExtendedTool<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT>
): ExtendedTool<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT> {
  return tool;
}
