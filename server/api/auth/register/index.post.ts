import { AuthServiceProvider, RepositoryProvider } from "~/server/utils";
import { UserDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<RegisterRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const body = await requestInputGetter.getValidatedBody(RegisterBodySchema);

    const isEmailAlreadyUsed = await RepositoryProvider.userRepository.exist({
      where: {
        email: body.email,
      },
    });
    if (isEmailAlreadyUsed)
      throw Exception.badRequest({
        data: {
          email: translator.t("errors.requests.register.email.alreadyUsed"),
        },
        translator,
      });

    const user = await RepositoryProvider.userRepository.addOne({
      data: {
        email: body.email,
        password: AuthServiceProvider.authService.hashPassword(body.password),
        firstName: body.firstName,
        lastName: body.lastName,
        role: "user",
      },
    });

    const userDTO = UserDTOMapper.fromUser(user);

    const accessToken = AuthServiceProvider.authService.createAccessToken(
      user,
      {
        event,
      },
    );

    return {
      user: userDTO,
      accessToken,
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
