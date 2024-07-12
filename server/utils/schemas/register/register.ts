import type { Simplify } from "type-fest";
import { z } from "zod";
import type { UserDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const RegisterBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;

export type RegisterData = {
  user: UserDTO;
};

export type RegisterRequest = Request<RegisterData, RegisterBody>;

export type RegisterError = Simplify<ResponseError<RegisterRequest>>;

export type RegisterErrorData = RegisterError["data"];
