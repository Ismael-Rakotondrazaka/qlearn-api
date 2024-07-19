import { AuthServiceProvider, RepositoryProvider } from "~/server/utils";
import { SessionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<StoreSessionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const authUser = await AuthServiceProvider.authService.authenticate({
      event,
      translator,
      validator,
    });

    const body = await requestInputGetter.getValidatedBody(
      StoreSessionBodySchema,
    );

    const quiz = await RepositoryProvider.quizRepository.findOne({
      where: {
        id: body.quizId,
      },
    });
    if (quiz === null)
      throw Exception.badRequest({
        data: {
          quizId: translator.t(
            "errors.requests.sessions.store.quizId.notFound",
          ),
        },
        translator,
      });

    const answers = await RepositoryProvider.answerRepository.findMany({
      where: {
        id: {
          in: body.sessionAnswers.map(
            (sessionAnswer) => sessionAnswer.selectedAnswerId,
          ),
        },
      },
    });

    if (answers.length !== body.sessionAnswers.length)
      throw Exception.badRequest({
        data: {
          sessionAnswers: translator.t(
            "errors.requests.sessions.store.sessionAnswers.differentSize",
          ),
        },
        translator,
      });

    const questionIdsByAnswerId = new Map<number, number>();
    body.sessionAnswers.forEach((sessionAnswer) => {
      questionIdsByAnswerId.set(
        sessionAnswer.selectedAnswerId,
        sessionAnswer.questionId,
      );
    });

    if (
      answers.some((answer) => {
        return answer.questionId !== questionIdsByAnswerId.get(answer.id);
      })
    )
      throw Exception.badRequest({
        data: {
          sessionAnswers: translator.t(
            "errors.requests.sessions.store.sessionAnswers.notMatchingQuestionId",
          ),
        },
        translator,
      });

    const session = await RepositoryProvider.sessionRepository.addOne({
      data: {
        quizId: body.quizId,
        userId: authUser.id,
        score: answers.reduce(
          (prev, curr) => (curr.isCorrect ? prev + 1 : prev),
          0,
        ),
      },
    });

    const sessionDTO = SessionDTOMapper.fromSession(session);

    return {
      session: sessionDTO,
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
