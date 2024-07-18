import type { ShowQuizRequest } from "~/server/utils";
import { RepositoryProvider, ShowQuizParamsSchema } from "~/server/utils";
import { QuizDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<ShowQuizRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const params =
      await requestInputGetter.getValidatedParams(ShowQuizParamsSchema);

    const quiz = await RepositoryProvider.quizRepository.findOne({
      where: {
        id: params.id,
      },
    });

    if (quiz === null)
      throw Exception.notFound({
        data: {},
        translator,
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
