import type { Simplify } from "type-fest";
import { z } from "zod";
import type { QuestionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const StartSessionBodySchema = z.object({
  difficulty: z.coerce.number().positive().int().min(1).max(5),
  categoryId: z.coerce.number().positive().int(),
});

export type StartSessionBody = z.infer<typeof StartSessionBodySchema>;

export type StartSessionData = {
  questions: QuestionDTO[];
};

export type StartSessionRequest = Request<StartSessionData, StartSessionBody>;

export type StartSessionError = Simplify<ResponseError<StartSessionRequest>>;

export type StartSessionErrorData = StartSessionError["data"];
