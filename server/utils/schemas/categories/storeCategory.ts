import type { Simplify } from "type-fest";
import { z } from "zod";
import type { CategoryDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export const StoreCategoryBodySchema = z.object({
  name: z.string(),
  description: z.string().min(1).nullable().optional(),
});

export type StoreCategoryBody = z.infer<typeof StoreCategoryBodySchema>;

export type StoreCategoryData = {
  category: CategoryDTO;
};

export type StoreCategoryRequest = Request<
  StoreCategoryData,
  StoreCategoryBody
>;

export type StoreCategoryError = Simplify<ResponseError<StoreCategoryRequest>>;

export type StoreCategoryErrorData = StoreCategoryError["data"];
