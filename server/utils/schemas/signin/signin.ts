import { z } from "zod";
import type { UserDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const SignInBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInBody = z.infer<typeof SignInBodySchema>;

export type SignInData = {
  user: UserDTO;
  accessToken: {
    token: string;
    expiresAt: Date;
  };
};

export type SignInRequest = Request<SignInData, SignInBody>;

export type SignInError = ResponseError<SignInRequest>;

export type SignInErrorData = SignInError["data"];
