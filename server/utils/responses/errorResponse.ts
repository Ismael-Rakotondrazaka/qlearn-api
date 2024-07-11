import type { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Request } from "../requests";

export interface ResponseError<
  TRequest extends Request<unknown, unknown, Record<string, never>, unknown>,
> {
  url: string;
  statusCode: StatusCodes;
  statusMessage: ReasonPhrases;
  message: string;
  stack: string;
  data: ResponseErrorData<TRequest["input"]["body"]>;
}

export type ResponseErrorData<TInput> = Partial<
  Record<Extract<keyof TInput, string>, string>
>;
