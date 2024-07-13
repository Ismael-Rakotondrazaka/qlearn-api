import type { Simplify } from "type-fest";
import { z } from "zod";
import type { CategoryDTO, UserDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";
import { StoreCategoryBodySchema } from "./storeCategory";


export const UpdateCategoryParamsSchema = z.object({
  id: z.coerce.number(),
});

export type UpdateCategoryParams = z.infer<typeof UpdateCategoryParamsSchema>;

export const UpdateCategoryBodySchema = StoreCategoryBodySchema.partial();
export type UpdateCategoryBody = z.infer<typeof UpdateCategoryBodySchema>;

export type UpdateCategoryData = {
  category: CategoryDTO;
};

export type UpdateCategoryRequest = Request<
  UpdateCategoryData,
  UpdateCategoryBody,
  UpdateCategoryParams
>;

export type UpdateCategoryError = Simplify<ResponseError<UpdateCategoryRequest>>;

export type UpdateCategoryErrorData = UpdateCategoryError["data"];
