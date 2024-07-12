import type { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Simplify } from "type-fest";
import type { Request } from "../requests";

export interface ResponseError<
  TRequest extends Request<
    unknown,
    unknown,
    Record<string, string | number | never>,
    unknown
  >,
> {
  url: string;
  statusCode: StatusCodes;
  statusMessage: ReasonPhrases;
  message: string;
  stack: string;
  data: TRequest["input"]["body"] extends Record<string, never>
    ? Record<string, never>
    : Simplify<ResponseErrorData<TRequest["input"]["body"]>>;
}

export type ResponseErrorData<TInput> = Partial<
  Record<Extract<keyof TInput, string>, string>
>;
