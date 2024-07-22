import type { Simplify } from "type-fest";
import { z } from "zod";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const IndexAnswerQuerySchema = z
  .object({
    "questionId[eq]": z.coerce.number(),
  })
  .partial();

export type IndexAnswerQuery = z.infer<typeof IndexAnswerQuerySchema>;

export type IndexAnswerData = {
  answers: AnswerDTO[];
};

export type IndexAnswerRequest = Request<
  IndexAnswerData,
  Record<string, never>,
  Record<string, never>,
  IndexAnswerQuery
>;

export type IndexAnswerError = Simplify<ResponseError<IndexAnswerRequest>>;

export type IndexAnswerErrorData = IndexAnswerError["data"];
