import { Exception, Translator, type IndexHelloRequest } from "../utils";
import type { ToEventHandler } from "../utils/requests/toEventHandler";

const __handler__: ToEventHandler<IndexHelloRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    return {
      message: `Hello World, it's ${new Date()}`,
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
