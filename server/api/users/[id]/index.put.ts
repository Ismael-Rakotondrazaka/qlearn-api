import { RepositoryProvider, UpdateUserParamsSchema } from "~/server/utils";
import { UserDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<UpdateUserRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    // TODO add auth check

    const params = await requestInputGetter.getValidatedParams(
      UpdateUserParamsSchema,
    );

    const user = await RepositoryProvider.userRepository.findOne({
      where: {
        id: params.id,
      },
    });
    if (user === null)
      throw Exception.notFound({
        data: {},
        translator,
      });

    const body =
      await requestInputGetter.getValidatedBody(UpdateUserBodySchema);

    const updatedUser = await RepositoryProvider.userRepository.updateOne({
      where: {
        id: user.id,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });

    return {
      user: UserDTOMapper.fromUser(updatedUser),
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
