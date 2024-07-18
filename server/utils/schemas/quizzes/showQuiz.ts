import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuizDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const ShowQuizParamsSchema = z.object({
  id: z.coerce.number(),
});

export type ShowQuizParams = z.infer<typeof ShowQuizParamsSchema>;

export type ShowQuizData = {
  quiz: QuizDTO;
};

export type ShowQuizRequest = Request<
  ShowQuizData,
  Record<string, never>,
  ShowQuizParams
>;

export type ShowQuizError = Simplify<ResponseError<ShowQuizRequest>>;

export type ShowQuizErrorData = ShowQuizError["data"];
