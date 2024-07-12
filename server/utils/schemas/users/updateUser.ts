import type { Simplify } from "type-fest";
import { z } from "zod";
import type { UserDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const UpdateUserParamsSchema = z.object({
  id: z.coerce.number(),
});

export type UpdateUserParams = z.infer<typeof UpdateUserParamsSchema>;

export const UpdateUserBodySchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
  })
  .partial();

export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;

export type UpdateUserData = {
  user: UserDTO;
};

export type UpdateUserRequest = Request<
  UpdateUserData,
  UpdateUserBody,
  UpdateUserParams
>;

export type UpdateUserError = Simplify<ResponseError<UpdateUserRequest>>;

export type UpdateUserErrorData = UpdateUserError["data"];
