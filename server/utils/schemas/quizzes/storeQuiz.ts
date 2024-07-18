import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuizDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const StoreQuizBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  difficulty: z.coerce.number().positive().int().min(1).max(5),
  categoryId: z.coerce.number().positive().int(),
});

export type StoreQuizBody = z.infer<typeof StoreQuizBodySchema>;

export type StoreQuizData = {
  quiz: QuizDTO;
};

export type StoreQuizRequest = Request<StoreQuizData, StoreQuizBody>;

export type StoreQuizError = Simplify<ResponseError<StoreQuizRequest>>;

export type StoreQuizErrorData = StoreQuizError["data"];
