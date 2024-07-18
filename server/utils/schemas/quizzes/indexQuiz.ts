import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuizDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const IndexQuizQuerySchema = z.object({
  "name[contains]": z.string().optional(),
  "description[contains]": z.string().optional(),
  "categoryId[eq]": z.coerce.number().optional(),
  "orderBy[createdAt]": z.enum(["asc", "desc"]).optional(),
  "orderBy[name]": z.enum(["asc", "desc"]).optional().default("asc"),
  "orderBy[difficulty]": z.enum(["asc", "desc"]).optional().default("asc"),
});

export type IndexQuizQuery = z.infer<typeof IndexQuizQuerySchema>;

export type IndexQuizData = {
  quizzes: QuizDTO[];
};

export type IndexQuizRequest = Request<
  IndexQuizData,
  Record<string, never>,
  Record<string, never>,
  IndexQuizQuery
>;

export type IndexQuizError = Simplify<ResponseError<IndexQuizRequest>>;

export type IndexQuizErrorData = IndexQuizError["data"];
