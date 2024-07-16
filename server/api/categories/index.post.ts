import type { StoreCategoryRequest, ToEventHandler } from "~/server/utils";
import { RepositoryProvider, StoreCategoryBodySchema } from "~/server/utils";
import { CategoryDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<StoreCategoryRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);

    const requestInputGetter = new RequestInputGetter(event, validator);

    const data = await requestInputGetter.getValidatedBody(
      StoreCategoryBodySchema,
    );

    const newCategory = await RepositoryProvider.categoryRepository.addOne({
      data,
    });

    return {
      category: CategoryDTOMapper.fromCategory(newCategory),
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
