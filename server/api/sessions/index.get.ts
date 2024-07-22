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

    const haveWhereQueries = Object.keys(query).some(
      (key) =>
        ["userId[eq]", "quizId[eq]"].includes(key) &&
        query[key as keyof typeof query] !== undefined,
    );

    const sessions = await RepositoryProvider.sessionRepository.findMany({
      where: {
        OR: haveWhereQueries
          ? [
              {
                userId: query["userId[eq]"],
                quizId: query["quizId[eq]"],
              },
            ]
          : undefined,
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
