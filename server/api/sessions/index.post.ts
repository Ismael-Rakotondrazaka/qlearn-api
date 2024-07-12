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

    // TODO verify if body.categoryId exists

    const answers = await RepositoryProvider.answerRepository.findMany({
      where: {
        AND: body.sessionAnswers.map((sessionAnswer) => {
          return {
            id: sessionAnswer.selectedAnswerId,
            question: {
              categoryId: body.categoryId,
              id: sessionAnswer.questionId,
              difficulty: body.difficulty,
            },
          };
        }),
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

    const session = await RepositoryProvider.sessionRepository.addOne({
      data: {
        difficulty: body.difficulty,
        categoryId: body.categoryId,
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
