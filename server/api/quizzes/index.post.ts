import type { StoreQuizRequest } from "~/server/utils";
import { RepositoryProvider, StoreQuizBodySchema } from "~/server/utils";
import { QuizDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<StoreQuizRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const body = await requestInputGetter.getValidatedBody(StoreQuizBodySchema);

    // TODO verify if body.categoryId exist

    const quiz = await RepositoryProvider.quizRepository.addOne({
      data: {
        description: body.description,
        difficulty: body.difficulty,
        name: body.name,
        categoryId: body.categoryId,
      },
    });

    const quizDTO = QuizDTOMapper.fromQuiz(quiz);

    return {
      quiz: quizDTO,
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
