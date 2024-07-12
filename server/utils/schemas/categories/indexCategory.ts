import type { Simplify } from "type-fest";
import { z } from "zod";
import type { CategoryDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const IndexCategoryQuerySchema = z
  .object({
    "orderBy[name]": z.enum(["asc", "desc"]).optional().default("asc"),
  })
  .partial();

export type IndexCategoryQuery = z.infer<typeof IndexCategoryQuerySchema>;

export type IndexCategoryData = {
  categories: CategoryDTO[];
};

export type IndexCategoryRequest = Request<
  IndexCategoryData,
  Record<string, never>,
  Record<string, never>,
  IndexCategoryQuery
>;

export type IndexCategoryError = Simplify<ResponseError<IndexCategoryRequest>>;

export type IndexCategoryErrorData = IndexCategoryError["data"];
