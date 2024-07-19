import { RepositoryProvider, StoreQuestionBodySchema } from "~/server/utils";
import { QuestionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<StoreQuestionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const body = await requestInputGetter.getValidatedBody(
      StoreQuestionBodySchema,
    );

    // TODO verify if body.categoryId exist

    const isNoCorrect = body.answers.every(
      (answer) => answer.isCorrect === false,
    );
    if (isNoCorrect)
      throw Exception.badRequest({
        data: {
          answers: translator.t(
            "errors.requests.questions.store.answers.noCorrect",
          ),
        },
        translator,
      });

    const isNoIncorrect = body.answers.every(
      (answer) => answer.isCorrect === true,
    );
    if (isNoIncorrect)
      throw Exception.badRequest({
        data: {
          answers: translator.t(
            "errors.requests.questions.store.answers.noIncorrect",
          ),
        },
        translator,
      });

    const question = await RepositoryProvider.questionRepository.addOne({
      data: {
        content: body.content,
        quizId: body.quizId,
        answers: {
          createMany: {
            data: body.answers,
          },
        },
      },
    });

    const questionDTO = QuestionDTOMapper.fromQuestion(question);

    return {
      question: questionDTO,
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
