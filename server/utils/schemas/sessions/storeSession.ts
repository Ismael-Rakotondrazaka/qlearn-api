import type { Simplify } from "type-fest";
import { z } from "zod";
import type { SessionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const StoreSessionBodySchema = z.object({
  difficulty: z.number().int().positive().min(1).max(5),
  categoryId: z.number().int().positive(),
  sessionAnswers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        selectedAnswerId: z.number().int().positive(),
      }),
    )
    .length(10),
});

export type StoreSessionParams = z.infer<typeof StoreSessionBodySchema>;

export type StoreSessionData = {
  session: SessionDTO;
};

export type StoreSessionRequest = Request<StoreSessionData, StoreSessionParams>;

export type StoreSessionError = Simplify<ResponseError<StoreSessionRequest>>;

export type StoreSessionErrorData = StoreSessionError["data"];
