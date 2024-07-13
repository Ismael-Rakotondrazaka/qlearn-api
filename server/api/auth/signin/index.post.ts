import { AuthServiceProvider, SignInBodySchema } from "~/server/utils";

const __handler__: ToEventHandler<SignInRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const body = await requestInputGetter.getValidatedBody(SignInBodySchema);

    const { user: userDTO, accessToken } =
      await AuthServiceProvider.authService.login(body.email, body.password, {
        event,
        translator,
      });

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
