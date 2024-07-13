import type { Simplify } from "type-fest";
import { z } from "zod";
import type { AnswerDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const UpdateAnswerParamsSchema = z.object({
  id: z.coerce.number(),
});

export const UpdateAnswerBodySchema = z.object({
  content: z.string().min(1),
});

export type UpdateAnswerParams = z.infer<typeof UpdateAnswerParamsSchema>;
export type UpdateAnswerBody = z.infer<typeof UpdateAnswerBodySchema>;

export type UpdateAnswerData = {
  answer: AnswerDTO;
};

export type UpdateAnswerRequest = Request<
  UpdateAnswerData,
  UpdateAnswerBody,
  UpdateAnswerParams
>;

export type UpdateAnswerError = Simplify<ResponseError<UpdateAnswerRequest>>;
export type UpdateAnswerErrorData = UpdateAnswerError["data"];
