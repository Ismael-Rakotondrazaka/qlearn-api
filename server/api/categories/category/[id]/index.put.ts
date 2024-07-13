import { RepositoryProvider } from "~/server/utils";
import { CategoryDTOMapper } from "~/server/utils/dtos";
import type { UpdateCategoryRequest } from "~/server/utils/schemas/categories/updateCategory";
import {
  UpdateCategoryBodySchema,
  UpdateCategoryParamsSchema,
} from "~/server/utils/schemas/categories/updateCategory";
const __handler__: ToEventHandler<UpdateCategoryRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const params = await requestInputGetter.getValidatedParams(
      UpdateCategoryParamsSchema,
    );

    const categoryFound = await RepositoryProvider.categoryRepository.findOne({
      where: {
        id: params.id,
      },
    });

    if (categoryFound == null) {
      throw Exception.notFound({
        data: {},
        translator,
      });
    }

    const body = await requestInputGetter.getValidatedBody(
      UpdateCategoryBodySchema,
    );

    const updatedCategory =
      await RepositoryProvider.categoryRepository.updateOne({
        where: {
          id: params.id,
        },
        data: {
          name: body.name,
          description: body.description,
        },
      });

    return {
      category: CategoryDTOMapper.fromCategory(updatedCategory),
    };
  } catch (error) {
    throw Exception.fromUnknown({
      error,
      event,
      translator,
    }).getNuxtError();
  }
};

export default defineEventHandler(__handler__);
