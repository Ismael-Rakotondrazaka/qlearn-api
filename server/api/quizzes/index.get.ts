import type { IndexQuizRequest } from "~/server/utils";
import { IndexQuizQuerySchema, RepositoryProvider } from "~/server/utils";
import { QuizDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<IndexQuizRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const query =
      await requestInputGetter.getValidatedQueries(IndexQuizQuerySchema);

    const quizzes = await RepositoryProvider.quizRepository.findMany({
      where: {
        name: {
          contains: query["name[contains]"],
          mode: "insensitive",
        },
        description: {
          contains: query["description[contains]"],
          mode: "insensitive",
        },
        categoryId: {
          equals: query["categoryId[eq]"],
        },
        difficulty: {
          equals: query["difficulty[eq]"],
        },
      },
      orderBy: [
        {
          difficulty: query["orderBy[difficulty]"],
        },
        {
          name: query["orderBy[name]"],
        },
        {
          createdAt: query["orderBy[createdAt]"],
        },
      ],
    });

    const quizDTOs = QuizDTOMapper.fromQuizzes(quizzes);

    return {
      quizzes: quizDTOs,
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
