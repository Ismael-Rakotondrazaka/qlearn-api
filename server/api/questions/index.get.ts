import { IndexQuestionQuerySchema, RepositoryProvider } from "~/server/utils";
import { QuestionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<IndexQuestionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const queries = await requestInputGetter.getValidatedQueries(
      IndexQuestionQuerySchema,
    );

    const haveWhereQueries = Object.keys(queries).some(
      (key) =>
        ["content[contains]"].includes(key) &&
        queries[key as keyof typeof queries] !== undefined,
    );

    const questions = await RepositoryProvider.questionRepository.findMany({
      where: {
        OR: haveWhereQueries
          ? [
              {
                content: {
                  contains: queries["content[contains]"],
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
      },
      orderBy: [
        {
          quiz: {
            difficulty: queries["orderBy[difficulty]"],
          },
        },
        {
          content: queries["orderBy[content]"],
        },
        {
          createdAt: queries["orderBy[createdAt]"],
        },
      ],
    });

    const questionDTOs = QuestionDTOMapper.fromQuestions(questions);

    return {
      questions: questionDTOs,
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
