import { RepositoryProvider } from "~/server/utils";
import { CategoryDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<IndexCategoryRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const query = await requestInputGetter.getValidatedQueries(
      IndexCategoryQuerySchema,
    );

    const categories = await RepositoryProvider.categoryRepository.findMany({
      orderBy: [
        {
          name: query["orderBy[name]"],
        },
      ],
    });

    return {
      categories: CategoryDTOMapper.fromCategories(categories),
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
