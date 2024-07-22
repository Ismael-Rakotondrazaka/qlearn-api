import type { H3Event } from "h3";
import type { QueryObject } from "ufo";
import type { z } from "zod";
import type { Validator } from "../validations";

export class RequestInputGetter<
  Request extends {
    body?: unknown;
    query?: QueryObject;
    routerParams?: Record<string, string | number | never>;
  },
> {
  // @ts-expect-error - In Request.routerParams, type number is not assignable to type string
  #event: H3Event<Request>;
  #validator: Validator;

  // @ts-expect-error - In Request.routerParams, type number is not assignable to type string
  constructor(event: H3Event<Request>, validator: Validator) {
    this.#event = event;
    this.#validator = validator;
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Body                                    */
  /* -------------------------------------------------------------------------- */

  async getUnsafeBody(): Promise<Request["body"]> {
    let result: unknown = {};

    const requestContentType: string | undefined = getHeader(
      this.#event,
      "Content-Type",
    );

    if (requestContentType !== undefined) {
      if (requestContentType.startsWith("application/json")) {
        try {
          const JSONBody: unknown = await readBody(this.#event);

          if (JSONBody !== undefined && JSONBody !== null) {
            result = JSONBody;
          }
        } catch (error) {
          return result;
        }
      } else if (
        requestContentType.startsWith("application/x-www-form-urlencoded") ||
        requestContentType.startsWith("multipart/form-data")
      ) {
        result = await readFormData(this.#event);
      }
    }

    return result;
  }

  async getValidatedBody<
    TSchema extends z.ZodType<Request["body"], z.ZodTypeDef, unknown>,
  >(schema: TSchema): Promise<Request["body"]> {
    const body = await this.getUnsafeBody();
    return this.#validator.validate(schema, body);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Params                                   */
  /* -------------------------------------------------------------------------- */

  getUnsafeParams() {
    return getRouterParams(this.#event);
  }

  async getValidatedParams<
    TSchema extends z.ZodType<Request["routerParams"], z.ZodTypeDef, unknown>,
  >(schema: TSchema) {
    return this.#validator.validate(schema, this.getUnsafeParams());
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Queries                                  */
  /* -------------------------------------------------------------------------- */

  getUnsafeQueries() {
    return getQuery(this.#event);
  }

  getValidatedQueries<
    TSchema extends z.ZodType<Request["query"], z.ZodTypeDef, unknown>,
  >(schema: TSchema) {
    return this.#validator.validate(schema, this.getUnsafeQueries());
  }
}
