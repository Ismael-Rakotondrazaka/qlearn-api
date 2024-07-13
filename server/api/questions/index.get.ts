import { IndexQuestionQuerySchema, RepositoryProvider } from "~/server/utils";
import { QuestionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<IndexQuestionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const query = await requestInputGetter.getValidatedQueries(
      IndexQuestionQuerySchema,
    );

    const questions = await RepositoryProvider.questionRepository.findMany({
      where: {
        content: {
          contains: query["content[contains]"],
          mode: "insensitive",
        },
      },
      orderBy: [
        {
          difficulty: query["orderBy[difficulty]"],
        },
        {
          content: query["orderBy[content]"],
        },
        {
          createdAt: query["orderBy[createdAt]"],
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
