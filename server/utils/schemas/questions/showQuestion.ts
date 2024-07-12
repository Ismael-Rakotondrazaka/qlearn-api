import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuestionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const ShowQuestionParamsSchema = z.object({
  id: z.coerce.number(),
});

export type ShowQuestionParams = z.infer<typeof ShowQuestionParamsSchema>;

export type ShowQuestionData = {
  question: QuestionDTO;
};

export type ShowQuestionRequest = Request<
  ShowQuestionData,
  Record<string, never>,
  ShowQuestionParams
>;

export type ShowQuestionError = Simplify<ResponseError<ShowQuestionRequest>>;

export type ShowQuestionErrorData = ShowQuestionError["data"];
