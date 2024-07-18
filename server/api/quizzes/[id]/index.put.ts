import type { UpdateQuizRequest } from "~/server/utils";
import {
  RepositoryProvider,
  UpdateQuizBodySchema,
  UpdateQuizParamsSchema,
} from "~/server/utils";
import { QuizDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<UpdateQuizRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const params = await requestInputGetter.getValidatedParams(
      UpdateQuizParamsSchema,
    );

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

    const body =
      await requestInputGetter.getValidatedBody(UpdateQuizBodySchema);

    const updatedQuiz = await RepositoryProvider.quizRepository.updateOne({
      where: {
        id: quiz.id,
      },
      data: {
        categoryId: body.categoryId,
        description: body.description,
        difficulty: body.difficulty,
        name: body.name,
      },
    });

    const quizDTO = QuizDTOMapper.fromQuiz(updatedQuiz);

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
