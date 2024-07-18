import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuizDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const UpdateQuizParamsSchema = z.object({
  id: z.coerce.number(),
});

export type UpdateQuizParams = z.infer<typeof UpdateQuizParamsSchema>;

export const UpdateQuizBodySchema = z
  .object({
    name: z.string(),
    description: z.string(),
    difficulty: z.coerce.number().positive().int().min(1).max(5),
    categoryId: z.coerce.number().positive().int(),
  })
  .partial();

export type UpdateQuizBody = z.infer<typeof UpdateQuizBodySchema>;

export type UpdateQuizData = {
  quiz: QuizDTO;
};

export type UpdateQuizRequest = Request<
  UpdateQuizData,
  UpdateQuizBody,
  UpdateQuizParams
>;

export type UpdateQuizError = Simplify<ResponseError<UpdateQuizRequest>>;

export type UpdateQuizErrorData = UpdateQuizError["data"];
