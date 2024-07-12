import { compareSync, hashSync } from "bcrypt";
import type { EventHandlerRequest, H3Event } from "h3";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserDTOMapper, type UserDTO } from "../dtos";
import type { UserRepository } from "../repositories";
import type { Translator } from "../translations";

import type { Role } from "@prisma/client";
import type { Simplify, SimplifyDeep } from "type-fest";
import type { Validator } from "../validations";

export type VerifyAccessTokenOptions = Simplify<
  Pick<jwt.VerifyOptions, "ignoreExpiration">
>;

export class AuthService {
  #userRepository: UserRepository;

  static readonly #schema = z.object({
    id: z.coerce.number(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date(),
    role: z.enum(["admin", "user"]),
  });

  static readonly #passwordSaltRound = 10;

  constructor(arg: { userRepository: UserRepository }) {
    this.#userRepository = arg.userRepository;
  }

  async login(
    email: string,
    password: string,
    opts: {
      event: H3Event<EventHandlerRequest>;
      translator: Translator;
    },
  ): Promise<{
    user: UserDTO;
    accessToken: {
      token: string;
      expiresAt: Date;
    };
  }> {
    const { translator, event } = opts;

    const user = await this.#userRepository.findOne({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    if (user === null)
      throw Exception.unauthorized({
        data: {},
        translator,
      });

    const isPasswordMatch = this.#comparePassword(password, user.password);

    if (!isPasswordMatch)
      throw Exception.unauthorized({
        data: {},
        translator,
      });

    const userDTO: UserDTO = UserDTOMapper.fromUser(user);

    return {
      user: userDTO,
      accessToken: this.createAccessToken(user, {
        event,
      }),
    };
  }

  createAccessToken(
    user: UserDTO,
    opts: {
      event: H3Event<EventHandlerRequest>;
    },
  ): {
    token: string;
    expiresAt: Date;
  } {
    const { event } = opts;

    const runtimeConfig = useRuntimeConfig(event);
    const accessTokenSecret: string = runtimeConfig.accessTokenSecret;
    const accessTokenLife: number = runtimeConfig.accessTokenLife;

    const token: string = jwt.sign(user, accessTokenSecret, {
      expiresIn: Math.round(accessTokenLife / 1000), // convert to seconds
    });

    const expiresAt = new Date(Date.now() + accessTokenLife);

    return {
      token,
      expiresAt,
    };
  }

  #verifyAccessToken(
    token: string,
    options?: VerifyAccessTokenOptions,
  ): string | jwt.JwtPayload | null {
    try {
      const runtimeConfig = useRuntimeConfig();
      const accessTokenSecret: string = runtimeConfig.accessTokenSecret;

      const decoded = jwt.verify(token, accessTokenSecret, options);

      return decoded;
    } catch (error) {
      return null;
    }
  }

  hashPassword(password: string): string {
    return hashSync(password, AuthService.#passwordSaltRound);
  }

  #comparePassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  async getUserPayload(opts: {
    validator: Validator;
    event: H3Event<EventHandlerRequest>;
  }): Promise<UserDTO | null> {
    const { event, validator } = opts;

    const header: string | undefined = getRequestHeader(event, "Authorization");

    if (header === undefined || !header.startsWith("Bearer ")) {
      return null;
    }

    const token: string = header.split(" ")[1];

    const payload = this.#verifyAccessToken(token);

    // already know that payload is not a string to be valid
    if (payload === null || typeof payload === "string") {
      return null;
    }

    const spr = await validator.validateSafe(
      AuthService.#schema,
      payload ?? {},
    );

    return spr.isSuccess ? spr.data : null;
  }

  async authenticate(opts: {
    validator: Validator;
    translator: Translator;
    event: H3Event<EventHandlerRequest>;
  }): Promise<UserDTO> {
    const { event, validator, translator } = opts;

    const result = await this.getUserPayload({
      event,
      validator,
    });

    if (result === null)
      throw Exception.unauthorized({
        translator,
        data: {},
      });

    return result;
  }

  async #authenticateByRole<T extends Role>(
    role: T,
    opts: {
      validator: Validator;
      translator: Translator;
      event: H3Event<EventHandlerRequest>;
    },
  ): Promise<
    SimplifyDeep<
      Exclude<UserDTO, "role"> & {
        role: T;
      }
    >
  > {
    const { event, validator, translator } = opts;

    const result = await this.getUserPayload({
      event,
      validator,
    });

    if (result === null)
      throw Exception.unauthorized({
        translator,
        data: {},
      });

    if (result.role !== role)
      throw Exception.forbidden({
        data: {},
        translator,
      });

    return result as SimplifyDeep<
      Exclude<UserDTO, "role"> & {
        role: T;
      }
    >;
  }

  async authenticateUserOnly(opts: {
    validator: Validator;
    translator: Translator;
    event: H3Event<EventHandlerRequest>;
  }): Promise<
    SimplifyDeep<
      Exclude<UserDTO, "role"> & {
        role: "user";
      }
    >
  > {
    const { event, validator, translator } = opts;

    return this.#authenticateByRole("user", {
      event,
      validator,
      translator,
    });
  }

  async authenticateAdminOnly(opts: {
    validator: Validator;
    translator: Translator;
    event: H3Event<EventHandlerRequest>;
  }): Promise<
    SimplifyDeep<
      Exclude<UserDTO, "role"> & {
        role: "admin";
      }
    >
  > {
    const { event, validator, translator } = opts;

    return this.#authenticateByRole("admin", {
      event,
      validator,
      translator,
    });
  }
}
