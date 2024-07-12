import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuestionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const StoreQuestionBodySchema = z.object({
  content: z.string(),
  answers: z
    .array(
      z.object({
        content: z.string(),
        isCorrect: z.boolean(),
      }),
    )
    .min(2)
    .max(4),
});

export type StoreQuestionBody = z.infer<typeof StoreQuestionBodySchema>;

export type StoreQuestionData = {
  question: QuestionDTO;
};

export type StoreQuestionRequest = Request<
  StoreQuestionData,
  StoreQuestionBody
>;

export type StoreQuestionError = Simplify<ResponseError<StoreQuestionRequest>>;

export type StoreQuestionErrorData = StoreQuestionError["data"];
