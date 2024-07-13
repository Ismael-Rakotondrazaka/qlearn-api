import { RepositoryProvider, ShowQuestionParamsSchema } from "~/server/utils";
import { QuestionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<ShowQuestionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const params = await requestInputGetter.getValidatedParams(
      ShowQuestionParamsSchema,
    );

    const question = await RepositoryProvider.questionRepository.findOne({
      where: {
        id: params.id,
      },
    });

    if (question === null)
      throw Exception.notFound({
        data: {},
        translator,
      });

    const questionDTO = QuestionDTOMapper.fromQuestion(question);

    return {
      question: questionDTO,
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
