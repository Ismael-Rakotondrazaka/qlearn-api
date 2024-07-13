import { RepositoryProvider } from "~/server/utils";
import { SessionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<ShowSessionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const params = await requestInputGetter.getValidatedParams(
      ShowSessionParamsSchema,
    );

    const session = await RepositoryProvider.sessionRepository.findOne({
      where: {
        id: params.id,
      },
    });

    if (session === null)
      throw Exception.notFound({
        data: {},
        translator,
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
