import type { Simplify } from "type-fest";
import type { UserDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export type WhoAmIData = {
  user: UserDTO | null;
};

export type WhoAmIRequest = Request<WhoAmIData>;

export type WhoAmIError = Simplify<ResponseError<WhoAmIRequest>>;

export type WhoAmIErrorData = WhoAmIError["data"];
