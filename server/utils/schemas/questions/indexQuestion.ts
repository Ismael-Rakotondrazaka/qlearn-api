import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuestionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const IndexQuestionQuerySchema = z.object({
  "content[contains]": z.string().optional(),
  "orderBy[createdAt]": z.enum(["asc", "desc"]).optional(),
  "orderBy[content]": z.enum(["asc", "desc"]).optional().default("asc"),
  "orderBy[difficulty]": z.enum(["asc", "desc"]).optional().default("asc"),
});

export type IndexQuestionQuery = z.infer<typeof IndexQuestionQuerySchema>;

export type IndexQuestionData = {
  questions: QuestionDTO[];
};

export type IndexQuestionRequest = Request<
  IndexQuestionData,
  Record<string, never>,
  Record<string, never>,
  IndexQuestionQuery
>;

export type IndexQuestionError = Simplify<ResponseError<IndexQuestionRequest>>;

export type IndexQuestionErrorData = IndexQuestionError["data"];
