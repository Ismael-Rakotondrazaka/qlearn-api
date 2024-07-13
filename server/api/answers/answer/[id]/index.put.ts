import type { UpdateAnswerRequest } from "~/server/utils";
import {
  RepositoryProvider,
  UpdateAnswerBodySchema,
  UpdateAnswerParamsSchema,
} from "~/server/utils";
import { AnswerDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<UpdateAnswerRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const answerParams = await requestInputGetter.getValidatedParams(
      UpdateAnswerParamsSchema,
    );

    const foundAnswer = await RepositoryProvider.answerRepository.findOne({
      where: {
        id: answerParams.id,
      },
    });

    if (foundAnswer == null) {
      throw Exception.notFound({
        data: {},
        translator,
      });
    }

    const body = await requestInputGetter.getValidatedBody(
      UpdateAnswerBodySchema,
    );

    const updatedAnswer = await RepositoryProvider.answerRepository.updateOne({
      where: {
        id: answerParams.id,
      },
      data: {
        content: body.content,
      },
    });

    return {
      answer: AnswerDTOMapper.fromAnswer(updatedAnswer),
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
