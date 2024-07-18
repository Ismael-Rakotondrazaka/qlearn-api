import { RepositoryProvider } from "~/server/utils";
import { SessionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<IndexSessionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const query = await requestInputGetter.getValidatedQueries(
      IndexSessionQuerySchema,
    );

    const sessions = await RepositoryProvider.sessionRepository.findMany({
      where: {
        userId: query["userId[eq]"],
        quizId: query["quizId[eq]"],
      },
      orderBy: {
        createdAt: query["orderBy[createdAt]"],
      },
    });

    const sessionDTOs = SessionDTOMapper.fromSessions(sessions);

    return {
      sessions: sessionDTOs,
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
