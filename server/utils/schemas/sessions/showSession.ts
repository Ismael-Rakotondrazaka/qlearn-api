import type { Simplify } from "type-fest";
import { z } from "zod";
import type { SessionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const ShowSessionParamsSchema = z.object({
  "orderBy[createdAt]": z.enum(["asc", "desc"]).optional().default("desc"),
});

export type ShowSessionParams = z.infer<typeof ShowSessionParamsSchema>;

export type ShowSessionData = {
  session: SessionDTO;
};

export type ShowSessionRequest = Request<
  ShowSessionData,
  Record<string, never>,
  ShowSessionParams
>;

export type ShowSessionError = Simplify<ResponseError<ShowSessionRequest>>;

export type ShowSessionErrorData = ShowSessionError["data"];
