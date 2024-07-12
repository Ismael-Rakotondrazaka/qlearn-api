import type { Simplify } from "type-fest";
import { z } from "zod";
import type { SessionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const IndexSessionQuerySchema = z.object({
  "orderBy[createdAt]": z.enum(["asc", "desc"]).optional().default("desc"),
});

export type IndexSessionQuery = z.infer<typeof IndexSessionQuerySchema>;

export type IndexSessionData = {
  sessions: SessionDTO[];
};

export type IndexSessionRequest = Request<
  IndexSessionData,
  Record<string, never>,
  Record<string, never>,
  IndexSessionQuery
>;

export type IndexSessionError = Simplify<ResponseError<IndexSessionRequest>>;

export type IndexSessionErrorData = IndexSessionError["data"];
