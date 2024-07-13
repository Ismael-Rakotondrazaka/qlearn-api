import { AuthServiceProvider } from "~/server/utils";

const __handler__: ToEventHandler<WhoAmIRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);

    const userDTO = await AuthServiceProvider.authService.getUserPayload({
      event,
      validator,
    });

    return {
      user: userDTO,
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
